import { NextResponse } from "next/server";
import sharp from "sharp";
import { auth } from "@/auth";
import { getAuthUserAvatar, getAuthUserById, updateAuthUserAvatar } from "@/utils/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const avatar = await getAuthUserAvatar(session.user.id);
  if (avatar) {
    return new NextResponse(new Uint8Array(avatar), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "private, max-age=300",
      },
    });
  }

  const user = await getAuthUserById(session.user.id);
  const seed = user?.name || user?.email || "RG GT";
  const diceBearUrl = new URL("https://api.dicebear.com/10.x/lorelei/svg");
  diceBearUrl.searchParams.set("seed", seed);
  diceBearUrl.searchParams.set("radius", "18");

  return NextResponse.redirect(diceBearUrl);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("avatar");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Le fichier doit être une image." }, { status: 400 });
  }

  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "Image trop lourde, maximum 4 Mo." }, { status: 400 });
  }

  const input = Buffer.from(await file.arrayBuffer());
  const webp = await sharp(input)
    .rotate()
    .resize(256, 256, { fit: "cover" })
    .webp({ quality: 86 })
    .toBuffer();

  await updateAuthUserAvatar(session.user.id, webp);

  return NextResponse.json({ success: true });
}
