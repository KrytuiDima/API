function convert() {
  const raw = document.getElementById('input').value.trim();
  const lines = raw.split('\n').filter(l => l.trim());

  const results = [];

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);

    // Перевірка: чи є рядок з результатом (має бути не менше 14 частин)
    if (parts.length < 14 || isNaN(parts[0])) continue;

    const [
      num,
      lastName, firstName, patronymic,
      region,
      grade,
      course,
      zaochneBall, zaochneRank,
      posterBall, posterRank,
      confBall, confRank,
      total,
      overallRank,
      place
    ] = parts;

    results.push({
      number: +num,
      name: `${lastName} ${firstName} ${patronymic}`,
      region: region,
      grade: grade,
      course: course,
      scores: {
        remote: +zaochneBall,
        remote_rank: +zaochneRank,
        poster: +posterBall,
        poster_rank: +posterRank,
        conference: +confBall,
        conference_rank: +confRank
      },
      total: +total,
      overall_rank: overallRank,
      place: place || ""
    });
  }

  document.getElementById('output').textContent = JSON.stringify(results, null, 2);
}