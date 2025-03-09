-- CreateTable
CREATE TABLE "FileMetadata" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "modified_at" TEXT NOT NULL,
    "author" TEXT NOT NULL,

    CONSTRAINT "FileMetadata_pkey" PRIMARY KEY ("id")
);
