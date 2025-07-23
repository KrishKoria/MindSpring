import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";
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
export const DELETE = async (req: Request) => {
  const session = await requireAdmin();
  try {
    const isProtected = await protector.protect(req, {
      fingerprint: session?.user?.id || "",
    });
    if (isProtected.isDenied()) {
      return NextResponse.json({ error: "Request Denied" }, { status: 403 });
    }
    const { key } = await req.json();
    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: key,
    });

    await S3.send(command);
    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
};
