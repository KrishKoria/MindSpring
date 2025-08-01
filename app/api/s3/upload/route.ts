import { env } from "@/lib/env";
import { fileUploadSchema } from "@/lib/schema";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/s3client";
import { aj, detectBot, fixedWindow } from "@/lib/arcjet";
import requireAdmin from "@/lib/data/admin/require-admin";

const protector = aj
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );
export const POST = async (req: Request) => {
  const session = await requireAdmin();
  try {
    const isProtected = await protector.protect(req, {
      fingerprint: session?.user?.id || "",
    });
    if (isProtected.isDenied()) {
      return NextResponse.json({ error: "Request Denied" }, { status: 403 });
    }
    const body = await req.json();
    const validation = fileUploadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid Request Body" },
        { status: 400 }
      );
    }
    const { fileName, contentType, size } = validation.data;
    const uniqueKey = uuidv4() + "-" + fileName;
    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      ContentType: contentType,
      ContentLength: size,
      Key: uniqueKey,
    });
    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360,
    });
    const response = {
      presignedUrl,
      uniqueKey,
    };
    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something Went Wrong" },
      { status: 500 }
    );
  }
};
