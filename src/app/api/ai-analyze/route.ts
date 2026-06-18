import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY не настроен в переменных окружения' },
        { status: 500 }
      );
    }

    const lead = await req.json();

    const prompt = `Ты — AI-аналитик CRM системы компании BLACKBORZ ENERGY DRINK. Проанализируй лида и дай оценку.

Данные лида:
- Имя: ${lead.name}
- Компания: ${lead.company}
- Email: ${lead.email}
- Источник: ${lead.source}
- Потенциальная ценность: ${lead.value.toLocaleString('fr-FR')} €
- Статус: ${lead.status}
- Заметки: ${lead.notes}
- Теги: ${lead.tags.join(', ')}
- Регион: ${lead.region || 'не указан'}

Верни JSON со следующей структурой (без markdown, только чистый JSON):
{
  "score": число от 0 до 100,
  "potential": "low" | "medium" | "high" | "very_high",
  "strengths": ["сильная сторона 1", "сильная сторона 2"],
  "risks": ["риск 1", "риск 2"],
  "nextSteps": ["следующий шаг 1", "следующий шаг 2", "следующий шаг 3"],
  "summary": "краткое резюме на 2-3 предложения"
}

Оценивай с точки зрения продаж энергетических напитков BLACKBORZ: учитывай объём аудитории клиента, частоту покупок, стратегическую ценность канала сбыта.`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    // Модель иногда оборачивает JSON в markdown ```json ... ``` — убираем
    const cleaned = content.text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/\s*```$/, '')
      .trim();

    const result = JSON.parse(cleaned);
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI analyze error:', error);
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка AI анализа: ${message}` }, { status: 500 });
  }
}
