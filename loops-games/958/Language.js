var Language = (function () {
    var root = {};
    root.language = "en";
    //Available -- disponível -- Có sẵn -- tersedia
    //Mine Shaft Available -- Eixo da mina disponível -- Trục mỏ có sẵn -- Poros Tambang Tersedia
    //There is no significant bottlenecks right now -- Não há gargalos significativos agora -- Không có nút thắt đáng kể ngay bây giờ -- Tidak ada hambatan yang signifikan sekarang
    //income boosts -- aumentos de renda


    //kembali

    root.data = [
        { "en": "You don't have enough Super Cash for that.", "pt-br": "Você não tem super dinheiro suficiente para isso.", "vi": "Anh không có đủ Tiền mặt cho việc đó.", "id": "Anda tidak memiliki cukup Super Cash untuk itu." },
        { "en": "Time Jump", "pt-br": "tempo", "vi": "thời gian", "id": "Waktu" },
        { "en": "Gain resources from the future instantly!", "pt-br": "Ganhe recursos do futuro instantaneamente!", "vi": "Thu được tài nguyên từ tương lai ngay lập tức!", "id": "Dapatkan sumber daya dari masa depan secara instan!" },
        { "en": "Gain extra income for one click!", "pt-br": "Ganhe renda extra por um clique!", "vi": "Kiếm thêm thu nhập chỉ với một cú nhấp chuột!", "id": "Dapatkan penghasilan tambahan untuk satu klik!" },
        { "en": "Income Boosts", "pt-br": "Aumentos de renda", "vi": "Tăng thu nhập", "id": "Peningkatan Pendapatan" },
        { "en": "The elevator can't keep up with the shaft.", "pt-br": "O elevador não consegue acompanhar o poço.", "vi": "Thang máy không thể bắt kịp với hầm.", "id": "Elevator tidak bisa mengikuti porosnya." },
        { "en": "New Shaft", "pt-br": "Novo Poço", "vi": "Hầm mới", "id": "Poros Baru" },
        { "en": "Elevator Manager", "pt-br": "Gerente de Elevadores", "vi": "Quản lý thang máy", "id": "Manajer Lift" },
        { "en": "UPGRADE", "pt-br": "melhorar", "vi": "NÂNG CẤP", "id": "TINGKATKAN" },
        { "en": "Mine Shaft Manager", "pt-br": "Gerente de poço de mina", "vi": "Quản lý hầm mỏ", "id": "Manajer Poros Tambang" },
        { "en": "Hire manager to automate your workers", "pt-br": "Contrate um gerente para automatizar seus funcionários", "vi": "Thuê quản lý để tự động hóa công nhân", "id": "Rekrut manajer untuk mengotomatiskan pekerjamu" },
        { "en": "Hire Manager", "pt-br": "Contratar", "vi": "Thuê quản lý", "id": "Rekrut" },
        { "en": "Ignativs Earle", "pt-br": "Ignativs Earle", "vi": "Ignativs Earle", "id": "Ignativs Earle" },
        { "en": "Senior", "pt-br": "Sênior", "vi": "Cấp cao", "id": "Senior" },
        { "en": "Active Boosts", "pt-br": "impulsionadores ativos", "vi": "tăng cường hoạt động", "id": "dorongan aktif" },
        { "en": "You Get ", "pt-br": "Você começa ", "vi": "Bạn nhận được ", "id": "Anda Dapatkan " },
        { "en": "Boost for", "pt-br": "Impulso para", "vi": "Tăng cường cho", "id": "Dorong untuk" },
        { "en": "You Get Super Cash", "pt-br": "Você recebe super dinheiro", "vi": "Bạn nhận được siêu tiền mặt", "id": "Anda Mendapatkan Super Cash" },
        { "en": "Inventory", "pt-br": "inventário", "vi": "Kho", "id": "inventarisasi" },
        { "en": "Congratulations", "pt-br": "parabéns", "vi": "Chúc mừng", "id": "Selamat" },
        { "en": "Effect", "pt-br": "Efeito", "vi": "Hiệu ứng", "id": "Efek" },
        { "en": " Walking Speed \nBoost", "pt-br": " Aumento de \nvelocidade", "vi": " Trợ Lực Tốc\n Độ Đi Bộ", "id": " Peningkatan\n Kecepatan Berjalan" },
        { "en": "Unassign", "pt-br": "Cancelar", "vi": "Bãi nhiệm", "id": "Batalkan" },
        { "en": "Assign", "pt-br": "Atribuir", "vi": "Ủy nhiệm", "id": "Tetapkan" },
        { "en": "No manager Assigned", "pt-br": "Nenhum gerente designado", "vi": "Không có người quản lý nào được chỉ định", "id": "Không có người quản lý nào được chỉ định" },
        { "en": "Albert", "pt-br": "Alberto", "vi": "Albert", "id": "Albert" },
        { "en": "use", "pt-br": "usar", "vi": "dùng", "id": "pakai" },
        { "en": "Use your boost item now!", "pt-br": "Use seu item boost agora!", "vi": "Sử dụng mục quảng cáo của bạn ngay bây giờ!", "id": "Gunakan item boost Anda sekarang!" },
        { "en": "Gretc", "pt-br": "Gretc", "vi": "Gretc", "id": "Gretc" },
        { "en": "Junior", "pt-br": "Júnior", "vi": "Cấp thấp", "id": "Junior" },
        { "en": "Senior", "pt-br": "Sênior", "vi": "Cấp cao", "id": "Senior" },
        { "en": "Executive", "pt-br": "Executivo", "vi": "Điều hành", "id": "Eksekutif" },
        { "en": " Mining Speed \nBoost", "pt-br": " Velocidade de \nmineração", "vi": " Trợ Lực Tốc Độ \nKhai Mỏ", "id": " Boost Kecepatan \nPenambangan" },
        { "en": "Upgrade Cost", "pt-br": "Custo de \nmelhoria", "vi": "Chi Phí Nâng Cấp", "id": "Biaya \nPeningkatan" },
        { "en": "Movement Speed \nBoost", "pt-br": "Aumento de \nvelocidade", "vi": "Trợ Lực Tốc Độ \nDi Chuyển", "id": "Boost Kecepatan \nGerakan" },
        { "en": "Loading Speed \nBoost", "pt-br": "Aumento de \nvelocidade", "vi": "Trợ Lực Tốc Độ Tải", "id": "Boost Kecepatan \nMemuat" },
        { "en": "Loading Expansion", "pt-br": "Expansão do \ncarregamento", "vi": "Mở Rộng Tải", "id": "Memuat Ekspansi" },
        { "en": "Cool Down", "pt-br": "Hora", "vi": "Hồi Phục", "id": "Pendinginan" },
        { "en": "Brant Fiona", "pt-br": "Brant Fiona", "vi": "Brant Fiona", "id": "Brant Fiona" },
        { "en": "Francis Dariu", "pt-br": "Francis Dariu", "vi": "Francis Dariu", "id": "Francis Dariu" },
        { "en": "David Glen", "pt-br": "David Glen", "vi": "David Glen", "id": "David Glen" },
        { "en": "Christopher Enya", "pt-br": "Christopher Enya", "vi": "Christopher Enya", "id": "Christopher Enya" },
        { "en": "stats", "pt-br": "estatí...", "vi": "chỉ số", "id": "stat" },
        { "en": "Boosts", "pt-br": "Aceler...", "vi": "Trợ lực", "id": "Boost" },
        { "en": "Shafts", "pt-br": "Poços", "vi": "Hầm", "id": "Poros" },
        { "en": "Idle Cash", "pt-br": "   Dinheiro ocioso", "vi": "   Tiền rảnh", "id": "   Uang Idle" },
        { "en": "Mine Shaft", "pt-br": "Poço da mina", "vi": "Hầm mỏ", "id": "Poros Tambang" },
        { "en": "Total Extraction", "pt-br": "Extração total", "vi": "Tổng khai thác", "id": "Total Ekstraksi" },
        { "en": "Walking Speed", "pt-br": "Velocidade de deslocamento", "vi": "Tốc Độ Đi", "id": "Kecepatan Berjalan" },
        { "en": "Miners", "pt-br": "Mineradores", "vi": "Thợ Đào", "id": "Penambang" },
        { "en": "Mining Speed Boost", "pt-br": "Velocidade de Mineração", "vi": "Tốc độ khai thác", "id": "Kecepatan Penambangan" },
        { "en": "Mining Speed", "pt-br": "Aumento de velocidade", "vi": "Trợ Lực Tốc Độ Khai Mỏ", "id": "Boost Kecepatan \nMenambang" },
        { "en": "Miner Capacity", "pt-br": "Capacidade do minerador", "vi": "Sức Chứa Thợ Đào", "id": "Kapasitas Penambang" },
        { "en": "Max", "pt-br": "Máx.", "vi": "Tối đa", "id": "Maks" },
        { "en": "Next boost at Level", "pt-br": "Próxima aceleração no nível", "vi": "Trợ lực tiếp theo ở cấp", "id": "Boost berikutnya di Level" },
        { "en": "Active all shaft manager skill\n at once", "pt-br": "Ative todas as habilidades do\n gerente de poço de uma vez", "vi": "Kích hoạt kỹ năng của tất\n cả quản lý mỏ cùng lúc", "id": "Aktifkan semua skill manajer\n poros sekaligus" },
        { "en": "Warehouse", "pt-br": "Armazém", "vi": "Nhà Kho", "id": "Gudang" },
        { "en": "warehouse manager", "pt-br": "gerente de Armazém", "vi": "quản lý kho", "id": "manajer gudang" },
        { "en": "Ware House", "pt-br": "Armazém", "vi": "Nhà Kho", "id": "Gudang" },
        { "en": "No manager available", "pt-br": "Nenhum gerente disponível", "vi": "Không có quản lý", "id": "Tidak ada manajer yang tersedia" },
        { "en": "No manager skills available", "pt-br": "Nenhuma habilidade de \ngerente disponível", "vi": "Không có kỹ năng quản lý", "id": "Tidak ada skill manajer yang tersedia" },
        { "en": "Elevator", "pt-br": "Elevador", "vi": "Thang Máy", "id": "Elevator" },
        { "en": "Total Transportation", "pt-br": "Transporte total", "vi": "Tổng Vận Chuyển", "id": "Total Transportasi" },
        { "en": "Load", "pt-br": "Carregar", "vi": "Tải", "id": "Muatan" },
        { "en": "Loading Speed", "pt-br": "Velocidade de \ncarregamento", "vi": "Tốc Độ Tải", "id": "Kecepatan Memuat" },
        { "en": "Movement Speed Boost", "pt-br": "Aumento de velocidade", "vi": "Trợ Lực Tốc Độ Di Chuyển", "id": "Boost Kecepatan \nGerakan" },
        { "en": "Movement Speed", "pt-br": "Velocidade de \nmovimento", "vi": "Tôc độ di chuyển", "id": "Kecepatan Gerakan" },
        { "en": "Elevator Details", "pt-br": "Detalhes do elevador", "vi": "Chi Tiết Thang Máy", "id": "Detail Elevator" },
        { "en": "Bottleneck", "pt-br": "Impedimento", "vi": "Cổ chai", "id": "Kemacetan" },
        { "en": "The warehouse can't keep up with the shaft", "pt-br": "O armazém não consegue acompanhar o poço", "vi": "Nhà kho không thể bắt kịp với hầm", "id": "Gudang tidak bisa mengikuti porosnya" },
        { "en": "The elevator can't keep up with the shaft", "pt-br": "O elevador não consegue acompanhar o poço", "vi": "Thang máy không thể bắt kịp với hầm", "id": "Elevator tidak bisa mengikuti porosnya" },
        { "en": "Upgrade Now", "pt-br": "Melhore agora", "vi": "Nâng cấp ngay", "id": "Tingkatkan Sekarang" },
        { "en": "Mineshafts Total Extraction", "pt-br": "Mineração total", "vi": "Tổng sản lượng khai thác", "id": "Total Ekstraksi Poros Tambang" },
        { "en": "Mineshaft B", "pt-br": "Mina B", "vi": "Hầm B", "id": "Tambang B" },
        { "en": "Extraction", "pt-br": "Extração", "vi": "Khai thác", "id": "Poros Tambang B" },
        { "en": "Albert Gretc", "pt-br": "Albert Gretc", "vi": "Albert Gretc", "id": "Ekstraksi" },
        { "en": "Easier\n Profitable", "pt-br": "Lucratividade\n mais fácil", "vi": "Dễ có lời", "id": "Albert Gretc" },
        { "en": "Best\n Mineshaft", "pt-br": "Melhor poço\n de mina", "vi": "Hầm mỏ\n tốt nhất", "id": "Lebih Mudah\n Menguntungkan" },
        { "en": "Active all shaft manager skill at once", "pt-br": "Ative todas as habilidades do gerente de poço de uma vez", "vi": "Kích hoạt kỹ năng của tất cả quản lý mỏ cùng lúc", "id": "Poros Tambang Terbaik" },
        { "en": "No manager skills available", "pt-br": "Nenhuma habilidade de gerente disponível", "vi": "Không có kỹ năng quản lý", "id": "Aktifkan semua skill manajer poros sekaligus" },
        { "en": "Active all manager at once", "pt-br": "Ative todos os gerentes...", "vi": "Kích hoạt tất cả quản...", "id": "Aktifkan semua manajer..." },
        { "en": "Active all", "pt-br": "Ativar todos", "vi": "Kích hoạt...", "id": "Aktifkan..." },
        { "en": "Sign In", "pt-br": "Entrar", "vi": "Đăng nhập", "id": "Masuk" },
        { "en": "Daily Reward", "pt-br": "Recompensa diária", "vi": "Phần thưởng hằng ngày", "id": "Hadiah Harian" },
        { "en": "Come back everyday to collect your reward", "pt-br": "Volte todos os dias para coletar \nsua recompensa", "vi": "Quay lại mỗi ngày để lấy \nphần thưởng", "id": "Kembalilah setiap hari untuk \nkumpulkan hadiahmu" },
        { "en": "Day", "pt-br": "Dia", "vi": "Ngày", "id": "Hari" },
        { "en": "days", "pt-br": "dias", "vi": "ngày", "id": "hari" },
        { "en": "collections", "pt-br": "coletas", "vi": "bộ sưu tập", "id": "koleksi" },
        { "en": "Ad1", "pt-br": "Anúncio", "vi": "QC", "id": "Iklan" },
        { "en": "Total Multiplier", "pt-br": "Multiplicador total", "vi": "Tổng hệ số", "id": "Total Pengali" },
        { "en": "for an additional 4H", "pt-br": "por mais 4h", "vi": "trong 4 giờ nữa", "id": "untuk 4 jam tambahan" },
        { "en": "in the Coal Mine", "pt-br": "na Mina de Carvão", "vi": "Trong Mỏ Than", "id": "di Tambang Batu Bara" },
        { "en": "income in the Coal Mine", "pt-br": "renda na Mina de Carvão", "vi": "thu nhập Trong Mỏ Than", "id": "Pendapatan pertambangan" },
        { "en": "Accumulative maximum time 24h", "pt-br": "Tempo máximo acumulativo 24h", "vi": "Tổng thời gian tối đa 24 giờ", "id": "Waktu maksimum akumulatif 24 jam" },
        { "en": "Award", "pt-br": "Assista mais", "vi": "Xem thêm", "id": "Tonton Selengkapnya" },
        { "en": "Boost Overview", "pt-br": "Visão geral das acelerações", "vi": "Tổng Quan Trợ Lực", "id": "Gambaran Umum Boost" },
        { "en": "Last for", "pt-br": "Duração de", "vi": "Kéo dài", "id": "Berlangsung selama" },
        { "en": "Boost succeeded", "pt-br": "Aceleração com sucesso", "vi": "Trợ lực thành công", "id": "Berhasil ditingkatkan" },
        { "en": "Copy success", "pt-br": "Copiado com sucesso", "vi": "Sao chép thành công", "id": "Berhasil disalin" },
        { "en": "Copy failed", "pt-br": "Falha ao copiar", "vi": "Sao chép thất bại", "id": "Gagal disalin" },
        { "en": "Sorry, not enough money", "pt-br": "Desculpe, dinheiro insuficiente", "vi": "Rất tiếc, không đủ tiền", "id": "Maaf, uang tidak cukup" },
        { "en": "All mines on continent must be unlocked first", "pt-br": "Todas as minas do continente devem ser desbloqueadas primeiro", "vi": "Trước tiên phải mở khóa tất cả mỏ trên lục địa", "id": "Semua tambang di benua harus dibuka dulu" },
        { "en": "Toast:", "pt-br": "Notificação do sistema:", "vi": "Tin nhắn bật lên:", "id": "Roti Bakar:" },
        { "en": "Mine Shaft Details", "pt-br": "Detalhes do poço da mina", "vi": "Chi Tiết Hầm Mỏ", "id": "Detail Poros Tambang" },
        { "en": "Ware House", "pt-br": "Armazém", "vi": "Nhà Kho", "id": "Gudang" },
        { "en": "You Used", "pt-br": "Você usou", "vi": "Bạn đã dùng", "id": "Kamu Menggunakan" },
        { "en": "Not Enough Super Cash", "pt-br": "Super Dinheiro insuficiente", "vi": "Không đủ siêu tiền", "id": "Uang Super Tidak Cukup" },
        { "en": "Confirm Purchase", "pt-br": "Confirmar compra", "vi": "Xác nhận mua", "id": "Konfirmasi Pembelian" },
        { "en": "You Bought", "pt-br": "Você comprou", "vi": "Bạn đã mua", "id": "Kamu Membeli" },
        { "en": "Use Now", "pt-br": "Use agora", "vi": "Dùng ngay", "id": "Gunakan Sekarang" },
        { "en": "Claim", "pt-br": "afirmação", "vi": "yêu cầu", "id": "klaim" },
        { "en": "More", "pt-br": "mais", "vi": "thêm", "id": "Selengkapnya" },
        { "en": "loading...", "pt-br": "Carregando...", "vi": "Đang tải...", "id": "Memuat..." },
        { "en": "Collectx2", "pt-br": "recolherx2", "vi": "sưu tầmx2", "id": "mengumpulkanx2" },
        { "en": "7days", "pt-br": "7dias", "vi": "7Ngày", "id": "7Hari" },
        { "en": "14days", "pt-br": "14dias", "vi": "14Ngày", "id": "14Hari" },
        { "en": "21days", "pt-br": "21dias", "vi": "21Ngày", "id": "21Hari" },
        { "en": "30days", "pt-br": "30dias", "vi": "30Ngày", "id": "30Hari" },
        { "en": "Collect", "pt-br": "recolher", "vi": "sưu tầm", "id": "mengump..." },
        { "en": "Idle Cash Gain", "pt-br": "Ganho de caixa ocioso", "vi": "Nhàn rỗi Cash Gain", "id": "Menganggur Cash Gain" },
        { "en": "Your miners worked hard for you \nwhile you were away", "pt-br": "Seus mineiros trabalharam duro \npara você enquanto você estava fora", "vi": "Những người thợ mỏ của bạn đã làm việc \nchăm chỉ cho bạn trong khi bạn vắng nhà", "id": "Penambang Anda bekerja keras untuk \nAnda saat Anda pergi" },
        { "en": "Watch Video", "pt-br": "Assista vídeo", "vi": "Xem video", "id": "Menonton video" },
        { "en": "Wait For", "pt-br": "Esperar por", "vi": "Chờ", "id": "Tunggu" },
        { "en": "Get Rewards", "pt-br": "Obter recompensas", "vi": "Được nhận thưởng", "id": "Dapatkan Hadiah" },
        { "en": "Each video gives a better reward", "pt-br": "Cada vídeo dá uma recompensa melhor", "vi": "Mỗi video mang lại một phần thưởng tốt hơn", "id": "Setiap video memberikan hadiah yang lebih baik" },
        { "en": "Resets in", "pt-br": "Reinicia em", "vi": "Đặt lại sau", "id": "Disetel ulang dalam" },
        { "en": "Your reward has increased", "pt-br": "Sua recompensa aumentou", "vi": "Phần thưởng của bạn đã tăng lên", "id": "Imbalan Anda telah meningkat" },
        { "en": "Comfirm Purchase", "pt-br": "Confirmar compra", "vi": "Xác nhận mua hàng", "id": "Konfirmasi pembelian" },
        { "en": "Workers", "pt-br": "Trabalhadoras", "vi": "Công nhân", "id": "Pekerja" },
        { "en": "There is no significant bottlenecks right now", "pt-br": "Não há gargalos significativos agora", "vi": "Không có tắc nghẽn đáng kể nào ngay bây giờ", "id": "Tidak ada hambatan yang signifikan saat ini" },
        { "en": "All shaft manager cool down", "pt-br": "Todo gerenciador de eixo \nresfria", "vi": "Tất cả bộ quản lý trục \nnguội đi", "id": "Semua manajer poros \nmenjadi dingin" },
        { "en": "All shaft manager actived", "pt-br": "Todo gerenciador de eixo ativado", "vi": "Đã kích hoạt tất cả trình quản lý trục", "id": "Semua manajer poros diaktifkan" },
        { "en": "Warehouae", "pt-br": "Armazém", "vi": "Kho", "id": "Gudang" },
        { "en": "Load per Transporter", "pt-br": "Carga por transportador", "vi": "Tải cho mỗi người vận \nchuyển", "id": "Beban per Transporter" },
        { "en": "Transporters", "pt-br": "Transporters", "vi": "Người vận chuyển", "id": "Transporters" },
        { "en": " Boost all", "pt-br": "Aumente tudo", "vi": "Tăng cường tất cả", "id": "Tingkatkan semua" },
        { "en": "Level", "pt-br": "nível", "vi": "mức", "id": "tingkat" },
        { "en": "income for", "pt-br": "renda para", "vi": "thu nhập cho", "id": "pendapatan untuk" },
        { "en": "Gain 1h resources from the future instantly!", "pt-br": "Obtenha 1 hora de recursos do futuro até agora!", "vi": "Nhận tài nguyên 1 giờ từ tương lai ngay b giờ!", "id": "Dapatkan 1 jam sumber daya dari masa depan hingga sekarang!" },
        { "en": "Gain 4h resources from the future instantly!", "pt-br": "Obtenha 4 hora de recursos do futuro até agora!", "vi": "Nhận tài nguyên 4 giờ từ tương lai ngay b giờ!", "id": "Dapatkan 4 jam sumber daya dari masa depan hingga sekarang!" },
        { "en": "Gain 1d resources from the future instantly!", "pt-br": "Obtenha 1 dia de recursos do futuro hoje!", "vi": "Nhận tài nguyên 1 ngày từ tương lai ngay hôm nay!", "id": "Dapatkan 1 hari sumber daya dari masa depan hari ini!" },
        { "en": "Gain 12h resources from the future instantly!", "pt-br": "Obtenha 12 hora de recursos do futuro até agora!", "vi": "Nhận tài nguyên 12 giờ từ tương lai ngay b giờ!", "id": "Dapatkan 12 jam sumber daya dari masa depan hingga sekarang!" },
        { "en": "Gain 3d resources from the future instantly!", "pt-br": "Obtenha 3 dia de recursos do futuro hoje!", "vi": "Nhận tài nguyên 3 ngày từ tương lai ngay hôm nay!", "id": "Dapatkan 3 hari sumber daya dari masa depan hari ini!" },
        { "en": "Gain 2d resources from the future instantly!", "pt-br": "Obtenha 2 dia de recursos do futuro hoje!", "vi": "Nhận tài nguyên 2 ngày từ tương lai ngay hôm nay!", "id": "Dapatkan 2 hari sumber daya dari masa depan hari ini!" },
        { "en": "Gain 5d resources from the future instantly!", "pt-br": "Obtenha 5 dia de recursos do futuro hoje!", "vi": "Nhận tài nguyên 5 ngày từ tương lai ngay hôm nay!", "id": "Dapatkan 5 hari sumber daya dari masa depan hari ini!" },
        { "en": "dummy", "pt-br": "boneco", "vi": "hình nộm", "id": "Dummy" },
        { "en": "Gold Mine", "pt-br": "mina de ouro", "vi": "Mỏ vàng", "id": "tambang emas" },
        { "en": "Income", "pt-br": "rendimento", "vi": "thu nhập", "id": "pendapatan" },
        { "en": "buy for", "pt-br": "comprar", "vi": "mua cho", "id": "beli untuk" },
        { "en": "yes", "pt-br": "sim", "vi": "Có", "id": "Ya" },
    ]


    root.getName = function (val) {
        for (let i = 0; i < root.data.length; i++) {
            if (root.data[i].en == val) {
                return root.data[i][root.language];
            }
        }
    }

    root.setNameLength = function (n) {
        return n.length > 7 ? n.substring(0, 7) + "..." : n;
    }

    root.getLanguage = function () {
        let res = hg.getSystemInfoSync();
        let arr = ["id", "pt-br", "vi"]

        for (let i = 0; i < arr.length; i++) {
            if (res.language == arr[i]) {
                root.language = res.language + "";
                return;
            } else {
                root.language = "en"
            }
        }
    }

    return root;
})();


