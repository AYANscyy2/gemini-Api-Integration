import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    let responseMessage = "I'm not sure how to respond to that.";
    if (prompt.toLowerCase().trim() === "hi") {
      responseMessage = "Hello! How can I assist you today?";
    }

    return NextResponse.json({ response: responseMessage }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
