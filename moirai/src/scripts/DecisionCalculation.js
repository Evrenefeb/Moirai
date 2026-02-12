/**
 * Moirai Karar Destek Algoritması
 * * Bu fonksiyon ham kriter ve seçenek verilerini alır,
 * Ağırlıklı Toplam Modeli (Weighted Sum Model) uygular
 * ve sıralı bir sonuç listesi döndürür.
 * * @param {Array} criteria - Kriter listesi [{id, name, weight}, ...]
 * @param {Array} options - Seçenek listesi [{id, name, scores:{...}}, ...]
 * @returns {Array} - Puanlanmış ve sıralanmış sonuç listesi
 */

export const calculateDecisionMatrix = (criteria, options) => {
    // 1. GÜVENLİK KONTROLÜ (Validasyon)
    if (!criteria || criteria.length === 0) {
        throw new Error("Henüz hiç kriter belirlemedin.");
    }
    if (!options || options.length === 0) {
        throw new Error("Henüz hiç seçenek girmedin.");
    }

    // 2. TOPLAM AĞIRLIĞI BUL (Payda)
    // Kullanıcı ağırlıkları boş bırakırsa 0 kabul ediyoruz
    let totalWeight = 0;
    criteria.forEach(c => {
        const w = parseFloat(c.weight);
        if (!isNaN(w)) totalWeight += w;
    });

    if (totalWeight === 0) {
        throw new Error("Kriterlerin toplam ağırlığı 0 olamaz. Lütfen kriterlere önem puanı ver.");
    }

    // 3. MATEMATİK MOTORU
    const processedResults = options.map(option => {
        let weightedSum = 0;
        let rawScores = {};      // Chart.js (Radar) için saf puanlar
        let weightedDetails = {}; // AI Context için detaylı analiz verisi

        criteria.forEach(criterion => {
            // Ham Puanı Al (Kullanıcının girdiği 1-10)
            // Eğer boşsa 0 kabul et
            const rawScore = parseFloat(option.scores[criterion.id]) || 0;
            const weight = parseFloat(criterion.weight) || 0;

            // Katkıyı Hesapla: (Puan x Ağırlık)
            const contribution = rawScore * weight;
            weightedSum += contribution;

            // VERİ PAKETLEME
            // 1. Chart.js için: { "Fiyat": 8, "Performans": 9 } formatında
            // Eğer isimsiz kriter varsa 'Kriter X' yazalım
            const criteriaName = criterion.name || `Kriter #${criterion.id}`;
            rawScores[criteriaName] = rawScore;

            // 2. AI Context için: Detaylı matematiksel döküm
            weightedDetails[criteriaName] = {
                weight: weight,
                givenScore: rawScore,
                contributionValue: contribution
            };
        });

        // 4. NORMALİZASYON (0-10 Skalasına İndirgeme)
        // Formül: (Toplam Ağırlıklı Puan / Toplam Ağırlık)
        // Örn: (85 / 100) * 10 = 8.5
        // Ama biz zaten ağırlıklarla çarptık, direkt bölelim.
        // Eğer 10 üzerinden değil 100 üzerinden istersen aşağıyı değiştirme, sadece gösterirken x10 yap.
        const finalScore = totalWeight > 0 ? (weightedSum / totalWeight) : 0;

        return {
            id: option.id,
            name: option.name || "İsimsiz Aday",
            finalScore: parseFloat(finalScore.toFixed(2)), // Virgülden sonra 2 hane (Örn: 8.45)
            rawScores: rawScores,
            breakdown: weightedDetails,
            totalWeightedSum: weightedSum, // Debug için
            totalPossibleWeight: totalWeight // Debug için
        };
    });

    // 5. SIRALAMA (Büyükten Küçüğe)
    // Eğer puanlar eşitse isme göre sırala (Deterministic Sort)
    const sortedResults = processedResults.sort((a, b) => {
        if (b.finalScore !== a.finalScore) {
            return b.finalScore - a.finalScore; // Puana göre
        }
        return a.name.localeCompare(b.name); // Eşitse alfabetik
    });

    return sortedResults;
};