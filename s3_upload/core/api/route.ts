import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/rate-limit";
import { requireModule, ModuleDisabledError } from "@/lib/modules";
import { getPresignedUploadUrl, getPublicUrl } from "@/lib/s3";
import { getClientIp } from "@/lib/security";

type UploadRequest = {
  filename: string;
  contentType: string;
};

const UPLOAD_RATE_LIMIT = 10;
const UPLOAD_WINDOW_MS = 60_000;

function getExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot === -1 ? "" : filename.slice(dot);
}

export async function POST(request: Request) {
  try {
    requireModule("s3_upload");
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
  }

  const ip = getClientIp(request);
  const result = rateLimit(
    `upload:${ip}`,
    UPLOAD_RATE_LIMIT,
    UPLOAD_WINDOW_MS,
  );

  if (!result.success) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((result.resetAt - Date.now()) / 1000),
          ),
        },
      },
    );
  }

  let body: UploadRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청 형식입니다" },
      { status: 400 },
    );
  }

  const { filename, contentType } = body;

  if (!filename || !contentType) {
    return NextResponse.json(
      { error: "파일명과 콘텐츠 타입은 필수입니다" },
      { status: 400 },
    );
  }

  if (!contentType.startsWith("image/")) {
    return NextResponse.json(
      { error: "이미지 파일만 업로드 가능합니다" },
      { status: 400 },
    );
  }

  const ext = getExtension(filename);
  const key = `uploads/${crypto.randomUUID()}${ext}`;

  try {
    const uploadUrl = await getPresignedUploadUrl(key, contentType);
    const publicUrl = getPublicUrl(key);

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (err) {
    console.error("S3 presigned URL 생성 실패:", err);
    return NextResponse.json(
      { error: "업로드 URL 생성에 실패했습니다" },
      { status: 500 },
    );
  }
}
