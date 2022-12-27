-- CreateEnum
CREATE TYPE "SentenceSource" AS ENUM ('wanikani', 'tatoeba');

-- CreateTable
CREATE TABLE "Sentences" (
    "uuid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMPTZ(6) DEFAULT (now() AT TIME ZONE 'utc'::text),
    "wanikaniLevel" SMALLINT,
    "wanikaniSubjectId" BIGINT,
    "tatoebaJaId" BIGINT,
    "tatoebaEnId" BIGINT,
    "sentenceJa" TEXT,
    "sentenceEn" TEXT,
    "sentenceJaFurigana" TEXT,
    "sourceUrl" TEXT,
    "source" "SentenceSource" NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT (now() AT TIME ZONE 'utc'::text),

    CONSTRAINT "Sentences_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sentences_tatoebaJaId_key" ON "Sentences"("tatoebaJaId");
