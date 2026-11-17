export const config = {
    coupleNames: process.env.NEXT_PUBLIC_COUPLE_NAMES || "ELIA & JUAN",
    eventDate: process.env.NEXT_PUBLIC_EVENT_DATE || "2026-12-13T09:00:00",
    groom: process.env.NEXT_PUBLIC_GROOM_NAME || "Adriel Juan Ardika",
    groomNickName: process.env.NEXT_PUBLIC_GROOM_NICKNAME || "Juan",
    groomInstagram: process.env.NEXT_PUBLIC_GROOM_INSTAGRAM || "juanardika",
    groomBio: process.env.NEXT_PUBLIC_GROOM_BIO || "Putra dari Bpk. Binang Mahaardika & Ibu Armadani Menur Wulan",
    bride: process.env.NEXT_PUBLIC_BRIDE_NAME || "Elia Kristiawati",
    brideNickName: process.env.NEXT_PUBLIC_BRIDE_NICKNAME || "Elia",
    brideInstagram: process.env.NEXT_PUBLIC_BRIDE_INSTAGRAM || "kristiawati_elia",
    brideBio: process.env.NEXT_PUBLIC_BRIDE_BIO || "Putri dari Bpk. Soepriyatno & Ibu Triani Siswati",
    bibleVerse: process.env.NEXT_PUBLIC_BIBLE_VERSE || "Kejadian 2:24 & Markus 10:9",
    bibleVerseContent: process.env.NEXT_PUBLIC_BIBLE_VERSE_CONTENT || "\"Sebab itu seorang laki-laki akan meninggalkan ayahnya dan ibunya dan bersatu dengan isterinya, sehingga keduanya menjadi satu daging.\" (Kejadian 2:24)\n\n\"Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.\" (Markus 10:9)",
    timeline_1: process.env.NEXT_PUBLIC_YEAR_1 || "Awal Bertemu",
    timeline_1_content: process.env.NEXT_PUBLIC_YEAR_1_CONTENT || "Kisah indah ini berawal dari pertemuan kami. Dua insan yang dipertemukan oleh Tuhan untuk saling mengenal dan melengkapi dalam kasih.",
    timeline_2: process.env.NEXT_PUBLIC_YEAR_2 || "Jadian",
    timeline_2_content: process.env.NEXT_PUBLIC_YEAR_2_CONTENT || "Setelah saling mengenal dan melewati perjalanan bersama, kami berkomitmen untuk melangkah ke masa depan dalam doa dan kasih.",
    timeline_3: process.env.NEXT_PUBLIC_YEAR_3 || "Lamaran",
    timeline_3_content: process.env.NEXT_PUBLIC_YEAR_3_CONTENT || "Juan memberanikan diri membawa keluarga besarnya bersilaturahmi ke kediaman Elia untuk melamar dan memohon restu pernikahan.",
    holyMatrimony: {
        enabled: process.env.NEXT_PUBLIC_HOLY_MATRIMONY !== 'false',
        time: process.env.NEXT_PUBLIC_HOLY_MATRIMONY_TIME || "Pukul 09.00 WIB",
        place: process.env.NEXT_PUBLIC_HOLY_MATRIMONY_PLACE || "GMAHK Gresik",
        place_details: process.env.NEXT_PUBLIC_HOLY_MATRIMONY_PLACE_DETAILS || "Jl. RA Kartini No. 60, Kabupaten Gresik, Jawa Timur 61122",
        googleMapsLink: process.env.NEXT_PUBLIC_HOLY_MATRIMONY_GOOGLE_MAPS || "https://www.google.com/maps/search/?api=1&query=GMAHK+Gresik+Jl+RA+Kartini+60",
    },
    weddingReception: {
        enabled: process.env.NEXT_PUBLIC_WEDDING_RECEPTION !== 'false',
        time: process.env.NEXT_PUBLIC_WEDDING_RECEPTION_TIME || "Pukul 13.00 WIB",
        place: process.env.NEXT_PUBLIC_WEDDING_RECEPTION_PLACE || "Gedung Dakwah Muhammadiyah Gresik",
        place_details: process.env.NEXT_PUBLIC_WEDDING_RECEPTION_PLACE_DETAILS || "Jl. Raya Permata No.7, Kembangan, Kec. Kebomas, Kabupaten Gresik, Jawa Timur 61124",
        googleMapsLink: process.env.NEXT_PUBLIC_WEDDING_RECEPTION_GOOGLE_MAPS || "https://www.google.com/maps/search/?api=1&query=Gedung+Dakwah+Muhammadiyah+Gresik+Jl+Raya+Permata+7",
    },
    livestreaming: {
        enabled: process.env.NEXT_PUBLIC_LIVE_STREAMING === 'true',
        time: process.env.NEXT_PUBLIC_LIVE_STREAMING_TIME || "12.00 WIB",
        link: process.env.NEXT_PUBLIC_LIVE_STREAMING_LINK || "https://instagram.com/kristiawati_elia",
        detail: process.env.NEXT_PUBLIC_LIVE_STREAMING_DETAIL || "Disiarkan langsung melalui akun Instagram kami",
    },
    prewedding: {
        enabled: process.env.NEXT_PUBLIC_PREWEDDING === 'true',
        link: process.env.NEXT_PUBLIC_PREWEDDING_CODE_LINK_EMBED || "",
        detail: process.env.NEXT_PUBLIC_PREWEDDING_DETAIL || "",
    },
    rsvp: {
        enabled: process.env.NEXT_PUBLIC_RSVP !== 'false',
        detail: process.env.NEXT_PUBLIC_RSVP_DETAIL || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
    },
    popupTemplate: process.env.NEXT_PUBLIC_POPUP_TEMPLATE || "Hai {nama}! Terima kasih telah membuka undangan kami. Mohon kesediaannya untuk mengisi ucapan doa dan konfirmasi kehadiran pada form RSVP di bawah ya!",
    thankyou: process.env.NEXT_PUBLIC_THANKYOU || "Terima Kasih Atas Doa & Restu Anda",
    thankyouDetail: process.env.NEXT_PUBLIC_THANKYOU_DETAIL || "Merupakan suatu kehormatan bagi kami atas kehadiran dan doa restu yang diberikan untuk hari bahagia kami.",
    craftedWithLove: process.env.NEXT_PUBLIC_CRAFTED_WITH_LOVE || "Crafted with Love for Elia & Juan",
    galleryImages: [
      "/dummy/gallery-1.jpg",
      "/dummy/gallery-2.jpg",
      "/dummy/gallery-3.jpg",
      "/dummy/gallery-4.jpg"
    ],
    weddingGift: {
        enabled: true,
        qrisImage: "",
        qrisOwnerName: "Elia & Juan",
        bankAccounts: [
            {
                bankName: "BCA",
                accountNumber: "5110127610",
                accountHolderName: "Elia Kristiawati"
            },
            {
                bankName: "Mandiri",
                accountNumber: "1410022533053",
                accountHolderName: "Adriel Juan Ardika"
            }
        ]
    }
};
