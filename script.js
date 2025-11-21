// --- Fungsi untuk Mengatur Tab (2 Halaman) ---
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.addEventListener('DOMContentLoaded', () => {
    // Pastikan tab 'Verify' aktif saat loading
    openTab({ currentTarget: document.querySelector('.tab-button') }, 'Verify'); 
});


// --- Fungsi Deteksi Hoax Sederhana (Ditingkatkan) ---
function checkHoax() {
    const newsText = document.getElementById('newsText').value.trim();
    // Teks versi lowercase untuk analisis kata kunci
    const lowerText = newsText.toLowerCase(); 
    const resultDiv = document.getElementById('result');

    // 1. Validasi Input Awal
    if (newsText.length < 50) {
        resultDiv.innerHTML = '<p>🟡 **INFO:** Teks terlalu pendek (minimal 50 karakter) untuk analisis yang berarti.</p>';
        resultDiv.className = 'result-box result-uncertain';
        return;
    }

    // Tampilkan loading
    resultDiv.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Sedang menganalisis teks leksikal dan struktural...</p>';
    resultDiv.className = 'result-box';

    
    // 2. Definisikan Ciri-ciri Hoax (Ciri Leksikal)
    const hoaxKeywords = [
        "wajib disebarkan", "segera sebarkan", "terbukti benar", "jangan sampai ketinggalan", 
        "fakta tak terbantahkan", "hanya anda yang bisa", "penting sekali", "sumber rahasia",
        "buktikan sendiri", "resmi dicabut", "tanpa izin", "pasti benar", "terancam bahaya",
        "peringatan keras", "kebenaran hakiki"
    ];

    // 3. Definisikan Ciri-ciri Ketidakpastian/Opini
    const uncertainKeywords = [
        "klaim", "dugaan", "opini", "kontroversi", "menurut sumber", "diperkirakan", "menganalisis", "potensi"
    ];

    
    // 4. Inisialisasi Analisis
    let hoaxScore = 0;
    let analysisNotes = [];

    // --- A. Analisis Kata Kunci Sensasional ---
    hoaxKeywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
            hoaxScore += 2; 
            analysisNotes.push(`Bahasa Sensasional: Mengandung frasa provokatif ("${keyword}").`);
        }
    });

    // --- B. Analisis Struktural/Format ---

    // Kapitalisasi Berlebihan (Jika ada lebih dari 1 blok 3 huruf kapital berurutan)
    const upperCaseBlocks = (newsText.match(/[A-Z]{3,}/g) || []).length; 
    if (upperCaseBlocks > 1) {
        hoaxScore += 1.5;
        analysisNotes.push(`Format: Penggunaan HURUF KAPITAL berlebihan (ditemukan ${upperCaseBlocks} blok).`);
    }

    // Penggunaan Tanda Seru Berlebihan (Jika ada lebih dari 4 tanda seru total)
    const exclamationCount = (newsText.match(/!/g) || []).length;
    if (exclamationCount >= 4) {
        hoaxScore += 1;
        analysisNotes.push(`Gaya Bahasa: Penggunaan Tanda Seru (!) berlebihan (${exclamationCount} kali).`);
    }

    // Penggunaan Angka Besar/Fantastis (Simulasi)
    if (lowerText.includes("triliun") || lowerText.includes("miliyar")) {
         analysisNotes.push(`Konten: Mengandung Angka Fantastis (perlu cek data dan sumber keuangan).`);
    }

    // --- C. Analisis Ketidakpastian (Opini/Klaim) ---
    uncertainKeywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
            analysisNotes.push(`Klaim: Teks mengandung klaim atau opini ("${keyword}").`);
            hoaxScore += 0.5; // Kontribusi kecil
        }
    });

    // --- D. Penentuan Hasil (Ambang Batas) ---
    let resultType = 'valid';
    let resultMessage = '🟢 **HASIL ANALISIS: TERLIHAT KREDIBEL.**';

    if (hoaxScore >= 3.0) {
        resultType = 'hoax';
        resultMessage = '🔴 **HASIL ANALISIS: KEMUNGKINAN BESAR HOAX!**';
    } else if (hoaxScore >= 1.0) {
        resultType = 'uncertain';
        resultMessage = '🟡 **HASIL ANALISIS: PERLU VERIFIKASI MENDALAM.**';
    }

    // Tampilkan hasil setelah penundaan simulasi
    setTimeout(() => {
        let notesHtml = '';
        if (analysisNotes.length > 0) {
            notesHtml = '<h4><i class="fas fa-microscope"></i> Ringkasan Analisis NEWS SCRIPT:</h4><ul>';
            analysisNotes.forEach(note => {
                notesHtml += `<li>${note}</li>`;
            });
            notesHtml += '</ul>';
        } else if (resultType === 'valid') {
            notesHtml = '<p>Teks memiliki gaya bahasa yang netral dan struktur yang wajar. Ciri-ciri penyebar *hoax* tidak terdeteksi secara kuat.</p>';
        }

        resultDiv.innerHTML = `${resultMessage}<br>${notesHtml}`;
        resultDiv.className = `result-box result-${resultType}`;
        
        // Instruksi edukasi
        if (resultType !== 'valid') {
             resultDiv.innerHTML += '<p style="margin-top:15px; font-size:0.9em;">**Jadilah Editor, Bukan Penyebar!** Cek tab "Kelas Anti-Hoax" untuk panduan Detektif Berita.</p>';
        } else {
             resultDiv.innerHTML += '<p style="margin-top:15px; font-size:0.9em;">**Ingat!** Selalu cek sumber asli beritanya. Algoritma ini hanya menganalisis teks.</p>';
        }

    }, 1500); // Simulasi waktu proses
}