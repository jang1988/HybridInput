import { NextRequest, NextResponse } from 'next/server';

const suggestions = ['apple', 'banana', 'cherry'];

export async function GET(request: NextRequest) {
  const input = new URL(request.url).searchParams.get('input');

  const filteredSuggestions = suggestions.filter(item => item.startsWith(input || ''));

  return NextResponse.json({ suggestions: filteredSuggestions });
}
