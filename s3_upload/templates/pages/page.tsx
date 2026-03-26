import { PageHeader } from "@/components/layout/page-header";

import { UploadSection } from "./upload-section";

export default function UploadPage() {
  const isS3Configured =
    !!process.env.AWS_S3_REGION &&
    !!process.env.AWS_S3_BUCKET &&
    !!process.env.AWS_S3_ACCESS_KEY_ID &&
    !!process.env.AWS_S3_SECRET_ACCESS_KEY;

  return (
    <div>
      <PageHeader
        title="이미지 업로드"
        description="AWS S3 드래그앤드롭 업로드 예시"
      />

      {isS3Configured ? null : (
        <div className="mb-4 rounded-lg border border-warning-300 bg-warning-50 p-4 dark:border-warning-700 dark:bg-warning-950">
          <p className="text-sm text-warning-800 dark:text-warning-300">
            S3 환경 변수가 설정되지 않았습니다. .env.local 파일에
            AWS_S3_REGION, AWS_S3_BUCKET, AWS_S3_ACCESS_KEY_ID,
            AWS_S3_SECRET_ACCESS_KEY를 설정해주세요.
          </p>
        </div>
      )}

      <UploadSection />
    </div>
  );
}
