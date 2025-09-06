import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Video, { IVideo } from '@/models/Video';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 });

    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json({ videos }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch the videos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions); /* from next auth */

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const body: IVideo = await request.json();

    if (
      !body.title?.trim() ||
      !body.description?.trim() ||
      !body.videoUrl?.trim() ||
      !body.thumbnailUrl?.trim()
    ) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }

    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body?.transformation?.quality ?? 100,
      },
    };
    const newVideo = await Video.create(videoData);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/videos error:', err);

    return NextResponse.json(
      {
        error: 'Failed to create the video',
      },
      { status: 500 }
    );
  }
}
