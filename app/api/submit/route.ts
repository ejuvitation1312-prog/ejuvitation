import { NextResponse } from "next/server";
import { createDynamicWish, getDynamicGuests } from "@/lib/dbHelper";

export async function POST(req: Request) {
  try {
    const { name, attendance, guests, message } = await req.json();
    const cleanName = String(name || "").trim();

    if (!cleanName || cleanName.toLowerCase() === "demo" || cleanName.toLowerCase() === "tamu undangan") {
      return NextResponse.json(
        { error: "Mode Demo: hanya tamu undangan terdaftar yang dapat mengisi RSVP." },
        { status: 403 }
      );
    }

    const registeredGuests = await getDynamicGuests();
    const isRegistered = registeredGuests.some(
      (g: any) => String(g.name || "").toLowerCase().trim() === cleanName.toLowerCase()
    );

    if (!isRegistered) {
      return NextResponse.json(
        { error: "Nama Anda tidak terdaftar dalam daftar tamu undangan." },
        { status: 403 }
      );
    }

    await createDynamicWish({ name: cleanName, attendance, guests: Number(guests), message });

    return NextResponse.json(
      {
        message: "RSVP submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to submit RSVP:", error);
    return new NextResponse("Failed to submit RSVP", { status: 500 });
  }
}

export async function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
