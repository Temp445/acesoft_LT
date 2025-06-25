// app/api/proxy-validate-email/route.ts 

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
// import { env } from "@/lib/env"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const API_KEY = process.env.EMAIL_VALIDATOR_SECRET!;
    const VALIDATOR_URL = process.env.EMAIL_VALIDATOR_URL!;

    if (!API_KEY || !VALIDATOR_URL) {
      return new NextResponse(
        JSON.stringify({ message: "Missing env variables" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await axios.post(
      VALIDATOR_URL,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return new NextResponse(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Validation proxy error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error calling validation API" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
