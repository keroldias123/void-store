import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const imageBase64 = body.imageBase64 as string | undefined
    if (!imageBase64) {
      return NextResponse.json({ error: "imageBase64 is required" }, { status: 400 })
    }

    // Exemplo de Upload para Cloudinary:
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        { error: "Cloudinary não configurado. Defina CLOUDINARY_CLOUD_NAME e CLOUDINARY_UPLOAD_PRESET" },
        { status: 500 }
      )
    }

    const formData = new FormData()
    formData.append("file", imageBase64)
    formData.append("upload_preset", uploadPreset)

    const cloudinaryResp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    })

    const uploadResult = await cloudinaryResp.json()

    if (!cloudinaryResp.ok) {
      return NextResponse.json({ error: "Erro no upload", detail: uploadResult }, { status: 500 })
    }

    return NextResponse.json({ url: uploadResult.secure_url })
  } catch (error) {
    console.error("Upload error", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
