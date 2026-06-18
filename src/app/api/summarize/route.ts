import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { leads, type } = await req.json();

    let prompt = '';

    if (type === 'pipeline') {
      const leadsText = leads
        .map(
          (l: { name: string; company: string; status: string; value: number; notes: string }) =>
            `- ${l.name} (${l.company}): статус "${l.status}", ценность ${l.value.toLocaleString('ru-RU')} ₽. ${l.notes}`
        )
        .join('\n');

      prompt = `Ты — бизнес-аналитик CRM системы BLACKBORZ ENERGY DRINK.

Проанализируй текущий пайплайн продаж и создай исполнительное резюме для руководства.

Лиды в пайплайне:
${leadsText}

Напиши структурированный отчёт на русском языке:
1. **Общая картина** (2-3 предложения о состоянии пайплайна)
2. **Ключевые возможности** (топ-3 сделки, на которые стоит сфокусироваться)
3. **Риски** (что может пойти не так)
4. **Рекомендации** (конкретные действия на ближайшую неделю)
5. **Прогноз** (ожидаемая выручка при текущем конверсии)

Будь конкретным и ориентированным на действия. Отвечай только на русском.`;
    } else if (type === 'single') {
      const lead = leads[0];
      prompt = `Ты — ассистент менеджера по продажам в BLACKBORZ ENERGY DRINK.

Создай краткое резюме для лида, которое менеджер может использовать перед звонком или встречей.

Данные лида:
- Имя: ${lead.name}
- Компания: ${lead.company}
- Источник: ${lead.source}
- Ценность: ${lead.value.toLocaleString('ru-RU')} ₽
- Текущий статус: ${lead.status}
- Заметки: ${lead.notes}
- AI оценка: ${lead.aiScore || 'не оценён'}

Напиши резюме в 3-5 предложениях: кто этот клиент, какова его ценность для BLACKBORZ, что важно знать перед контактом, какой следующий шаг рекомендуется.`;
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    return NextResponse.json({ summary: content.text });
  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json({ error: 'Ошибка создания резюме' }, { status: 500 });
  }
}
