import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message, wikipediaLink } = await req.json();

  if (!message.trim()) {
    return NextResponse.json({
      status: 500,
      statusMessage: 'Empty messages not accepted!',
    });
  }

  try {
    const success = await prisma.suggestions.create({
      data: {
        message: message,
        ...(wikipediaLink && { wikipediaLink }),
      },
    });

    if (success) {
      return NextResponse.json({
        status: 200,
        statusMessage: 'Suggestion submitted!',
      });
    } else {
      return NextResponse.json({
        status: 500,
        statusMessage: success,
      });
    }
  } catch (e) {
    return NextResponse.json({
      status: 500,
      statusMessage: `Internal Server Error: ${(e as Error).message}`,
    });
  }
}
