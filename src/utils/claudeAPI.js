// utils/claudeAPI.js - Updated to use Vercel proxy

export async function generateAIFeedback(
  weekNumber,
  weekTitle,
  optionId,
  optionTitle,
  newMetrics,
  weekData,
  selectedOption,
  oldMetrics,
  onChunk
) {
  const context = `
Тиждень ${weekNumber}: ${weekTitle}
Фаза: ${weekData.phase}

Контекст:
${weekData.context}

Обране рішення: Опція ${optionId} - ${optionTitle}
${selectedOption.description}

Наслідки:
${selectedOption.consequences.immediate}

Зміни метрик:
- Довіра клієнта: ${oldMetrics.clientTrust} → ${newMetrics.clientTrust} (${newMetrics.clientTrust - oldMetrics.clientTrust > 0 ? '+' : ''}${newMetrics.clientTrust - oldMetrics.clientTrust})
- Настрій команди: ${oldMetrics.teamMood} → ${newMetrics.teamMood} (${newMetrics.teamMood - oldMetrics.teamMood > 0 ? '+' : ''}${newMetrics.teamMood - oldMetrics.teamMood})
- Техборг: ${oldMetrics.techDebt} → ${newMetrics.techDebt} (${newMetrics.techDebt - oldMetrics.techDebt > 0 ? '+' : ''}${newMetrics.techDebt - oldMetrics.techDebt})
- Ризик дедлайну: ${oldMetrics.timelineRisk} → ${newMetrics.timelineRisk} (${newMetrics.timelineRisk - oldMetrics.timelineRisk > 0 ? '+' : ''}${newMetrics.timelineRisk - oldMetrics.timelineRisk})
`;

  const prompt = `Ти досвідчений PM, який аналізує рішення іншого PM.

${context}

Напиши короткий фідбек (3-4 речення) українською мовою:
1. Що дало це рішення (чому спрацювало або ні)
2. Які trade-offs були зроблені
3. Що варто врахувати далі

Природна розмовна українська, як говорять PM в офісах. Без формальностей.`;

  try {
    // 👇 USE VERCEL PROXY instead of direct API call
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            
            if (parsed.type === 'content_block_delta') {
              const text = parsed.delta?.text || '';
              fullText += text;
              
              if (onChunk) {
                onChunk(fullText);
              }
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    return fullText || 'Фідбек тимчасово недоступний';
    
  } catch (error) {
    console.error('AI Feedback error:', error);
    return 'Помилка генерації фідбеку. Спробуйте ще раз.';
  }
}

export async function generateFinalReview(
  decisionHistory,
  finalMetrics,
  scenarioData,
  onChunk
) {
  const decisions = decisionHistory
    .map((d) => `Week ${d.week}: ${d.title}`)
    .join('\n');

  const prompt = `Ти досвідчений PM, який аналізує 12-тижневий проєкт.

Проєкт: ${scenarioData.projectBrief.name}
Контекст: ${scenarioData.projectBrief.context}

Прийняті рішення:
${decisions}

Фінальні метрики:
- Довіра клієнта: ${finalMetrics.clientTrust}/100
- Настрій команди: ${finalMetrics.teamMood}/100
- Техборг: ${finalMetrics.techDebt}/100
- Ризик дедлайну: ${finalMetrics.timelineRisk}/100

Напиши фінальний огляд (5-7 речень) українською:
1. Що сталося з проєктом
2. Як команда себе почуває
3. Що вийшло добре, що ні
4. Головний урок з цього проєкту

Природна розмовна українська. Чесно, без прикрас.`;

  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            
            if (parsed.type === 'content_block_delta') {
              const text = parsed.delta?.text || '';
              fullText += text;
              
              if (onChunk) {
                onChunk(fullText);
              }
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    return fullText || 'Фінальний огляд тимчасово недоступний';
    
  } catch (error) {
    console.error('Final Review error:', error);
    return 'Помилка генерації фінального огляду.';
  }
}
