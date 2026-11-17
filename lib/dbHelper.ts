import fs from "fs/promises";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const DATA_DIR = path.join(process.cwd(), "lib", "data");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {}
}

async function safeWriteFile(filePath: string, content: string) {
  if (process.env.NODE_ENV !== "production") {
    await fs.writeFile(filePath, content);
  }
}

// Default settings values (Elia & Juan wedding defaults)
function getDefaultSettings() {
  return {
    coupleNames: "ELIA & JUAN",
    eventDate: "2026-12-13T09:00:00",
    groom: "Adriel Juan Ardika",
    groomNickName: "Juan",
    groomInstagram: "juanardika",
    groomBio: "Putra dari Bpk. Binang Mahaardika & Ibu Armadani Menur Wulan",
    groomTitleFront: "",
    groomTitleBack: "",
    bride: "Elia Kristiawati",
    brideNickName: "Elia",
    brideInstagram: "kristiawati_elia",
    brideBio: "Putri dari Bpk. Soepriyatno & Ibu Triani Siswati",
    brideTitleFront: "",
    brideTitleBack: "",
    bibleVerse: "Kejadian 2:24 & Markus 10:9",
    bibleVerseContent: "\"Sebab itu seorang laki-laki akan meninggalkan ayahnya dan ibunya dan bersatu dengan isterinya, sehingga keduanya menjadi satu daging.\" (Kejadian 2:24)\n\n\"Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.\" (Markus 10:9)",
    timeline_1: "Awal Bertemu",
    timeline_1_content: "Kisah indah ini berawal dari pertemuan kami. Dua insan yang dipertemukan oleh Tuhan untuk saling mengenal dan melengkapi dalam kasih.",
    timeline_2: "Jadian",
    timeline_2_content: "Setelah saling mengenal dan melewati perjalanan bersama, kami berkomitmen untuk melangkah ke arah masa depan bersama dalam doa dan komitmen.",
    timeline_3: "Lamaran",
    timeline_3_content: "Juan memberanikan diri membawa keluarga besarnya bersilaturahmi ke kediaman Elia untuk melamar dan memohon restu pernikahan.",
    timeline_4: "",
    timeline_4_content: "",
    timeline_5: "",
    timeline_5_content: "",
    timelineCount: 3,
    holyMatrimony: {
      enabled: true,
      time: "Pukul 09.00 WIB",
      place: "GMAHK Gresik",
      place_details: "Jl. RA Kartini No. 60, Kabupaten Gresik, Jawa Timur 61122",
      googleMapsLink: "https://www.google.com/maps/search/?api=1&query=GMAHK+Gresik+Jl+RA+Kartini+60",
    },
    weddingReception: {
      enabled: true,
      time: "Pukul 13.00 WIB",
      place: "Gedung Dakwah Muhammadiyah Gresik",
      place_details: "Jl. Raya Permata No.7, Kembangan, Kec. Kebomas, Kabupaten Gresik, Jawa Timur 61124",
      googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Gedung+Dakwah+Muhammadiyah+Gresik+Jl+Raya+Permata+7",
    },
    livestreaming: {
      enabled: true,
      time: "12.00 WIB",
      link: "https://instagram.com/kristiawati_elia",
      detail: "Disiarkan langsung melalui akun Instagram kami",
    },
    prewedding: {
      enabled: false,
      link: "",
      detail: "",
    },
    rsvp: {
      enabled: true,
      detail: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
    },
    thankyou: "Terima Kasih Atas Doa & Restu Anda",
    thankyouDetail: "Merupakan suatu kehormatan bagi kami atas kehadiran dan doa restu yang diberikan untuk hari bahagia kami.",
    closingBoxPosition: "bottom",
    craftedWithLove: "Crafted with Love for Elia & Juan",
    musicPath: "/music/wedding_song.mp3",
    galleryImages: [
      "/dummy/gallery-1.jpg",
      "/dummy/gallery-2.jpg",
      "/dummy/gallery-3.jpg",
      "/dummy/gallery-4.jpg",
    ],
    slideImages: {
      slide1: "/dummy/cover-1.jpg",
      slide2: "/dummy/wanita.jpg",
      slide3: "/dummy/pria.jpg",
      slide4: "/dummy/story-1.jpg",
      slide5: "/dummy/story-1.jpg",
      slide6: "/dummy/story-2.jpg",
      slide7: "/dummy/gallery-1.jpg",
      slide8: "/dummy/gallery-4.jpg",
      slide9: "/dummy/cover-2.jpg",
      slide10: "/dummy/cover-1.jpg",
      sideImage: "/dummy/cover-1.jpg",
    },
    invitationTemplate: `Shalom / Salam Sejahtera {nama},

Dengan penuh rasa syukur atas berkat dan kasih karunia Tuhan, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri ibadah Pemberkatan dan Resepsi Pernikahan kami:

🕊️ Elia Kristiawati & Adriel Juan Ardika 🕊️

📅 Hari/Tgl: Minggu, 13 Desember 2026
📍 Pemberkatan: GMAHK Gresik (Pukul 09.00 WIB)
📍 Resepsi: Gedung Dakwah Muhammadiyah Gresik (Pukul 13.00 WIB)

Untuk melihat informasi lengkap acara, peta lokasi, dan konfirmasi kehadiran, silakan kunjungi link undangan digital kami:
👉 {link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Jangan lupa untuk mengisi ucapan dan konfirmasi kehadiran pada form RSVP di link ya!

Terima kasih banyak atas doa dan perhatiannya. Tuhan Yesus memberkati! 🙏✨`,
    popupTemplate: `Hai {nama}! Terima kasih telah membuka undangan kami. Mohon kesediaannya untuk mengisi ucapan doa dan konfirmasi kehadiran pada form RSVP di bawah ya!`,
    weddingGift: {
      enabled: true,
      qrisImage: "",
      qrisOwnerName: "Elia & Juan",
      bankAccounts: [
        { bankName: "BCA", accountNumber: "5110127610", accountHolderName: "Elia Kristiawati" },
        { bankName: "Mandiri", accountNumber: "1410022533053", accountHolderName: "Adriel Juan Ardika" },
      ],
    },
    dresscode: {
      enabled: false,
      title: "Dresscode",
      text: "",
      image: "",
    },
  };
}

// ============ SETTINGS ============

export async function getDynamicSettings() {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("data")
        .limit(1)
        .single();

      if (!error && data) {
        return { ...getDefaultSettings(), ...data.data };
      }
    } catch (err) {
      console.warn("Supabase fetch settings failed, using file fallback.", err);
    }
  }

  // Fallback to JSON file
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, "settings.json");
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    return { ...getDefaultSettings(), ...JSON.parse(fileData) };
  } catch (e) {
    const defaults = getDefaultSettings();
    await safeWriteFile(filePath, JSON.stringify(defaults, null, 2));
    return defaults;
  }
}

export async function updateDynamicSettings(newData: any) {
  if (isSupabaseConfigured()) {
    try {
      // Check if a row exists
      const { data: existing } = await supabase
        .from("settings")
        .select("id")
        .limit(1)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from("settings")
          .update({ data: newData, updated_at: new Date().toISOString() })
          .eq("id", existing.id)
          .select("data")
          .single();
        if (!error && data) return { ...getDefaultSettings(), ...data.data };
      } else {
        const { data, error } = await supabase
          .from("settings")
          .insert({ data: newData })
          .select("data")
          .single();
        if (!error && data) return { ...getDefaultSettings(), ...data.data };
      }
    } catch (err) {
      console.warn("Supabase save settings failed, using file fallback.", err);
    }
  }

  // Fallback to JSON file
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, "settings.json");
  await safeWriteFile(filePath, JSON.stringify(newData, null, 2));
  return newData;
}

// ============ GUESTS ============

export async function getDynamicGuests() {
  try {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      // Map Supabase column names to match frontend expected format
      return data.map((g: any) => ({
        _id: g.id,
        name: g.name,
        phone: g.phone,
        status: g.status,
        sentAt: g.sent_at,
        createdAt: g.created_at,
        updatedAt: g.updated_at,
      }));
    }
  } catch (err) {
    console.warn("Supabase fetch guests failed, using file fallback.", err);
  }

  // Fallback to JSON file
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, "guests.json");
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch (e) {
    return [];
  }
}

export async function createDynamicGuest(guestData: any) {
  try {
    const { data, error } = await supabase
      .from("guests")
      .insert({
        name: guestData.name,
        phone: guestData.phone || "",
        status: guestData.status || "Belum Dikirim",
      })
      .select()
      .single();

    if (!error && data) {
      return {
        _id: data.id,
        name: data.name,
        phone: data.phone,
        status: data.status,
        sentAt: data.sent_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  } catch (err) {
    console.warn("Supabase create guest failed, using file fallback.", err);
  }

  // Fallback to JSON file
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, "guests.json");
  let guests = [];
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    guests = JSON.parse(fileData);
  } catch (e) {}

  const newGuest = {
    _id: `json_${Date.now()}`,
    ...guestData,
    status: guestData.status || "Belum Dikirim",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  guests.unshift(newGuest);
  await safeWriteFile(filePath, JSON.stringify(guests, null, 2));
  return newGuest;
}

export async function bulkCreateDynamicGuests(names: string[]) {
  if (!names || names.length === 0) return { inserted: [], count: 0 };

  const rows = names.map((name) => ({
    name,
    phone: "",
    status: "Belum Dikirim",
  }));

  try {
    const { data, error } = await supabase
      .from("guests")
      .insert(rows)
      .select();

    if (!error && data) {
      return {
        inserted: data.map((g: any) => ({
          _id: g.id,
          name: g.name,
          phone: g.phone,
          status: g.status,
          sentAt: g.sent_at,
          createdAt: g.created_at,
          updatedAt: g.updated_at,
        })),
        count: data.length,
      };
    }
    throw new Error(error?.message || "Supabase insert failed");
  } catch (err) {
    console.warn("Supabase bulk create guests failed, using file fallback.", err);
  }

  // Fallback: insert one by one into JSON file
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, "guests.json");
  let guests: any[] = [];
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    guests = JSON.parse(fileData);
  } catch (e) {}

  const newGuests = names.map((name, i) => ({
    _id: `json_${Date.now()}_${i}`,
    name,
    phone: "",
    status: "Belum Dikirim",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  guests.push(...newGuests);
  await safeWriteFile(filePath, JSON.stringify(guests, null, 2));
  return { inserted: newGuests, count: newGuests.length };
}

export async function updateDynamicGuest(id: string, guestData: any) {
  // If it's a JSON fallback ID, skip Supabase
  if (!id.startsWith("json_")) {
    try {
      const updatePayload: any = {};
      if (guestData.name !== undefined) updatePayload.name = guestData.name;
      if (guestData.phone !== undefined) updatePayload.phone = guestData.phone;
      if (guestData.status !== undefined) updatePayload.status = guestData.status;
      if (guestData.sentAt || guestData.sent_at) updatePayload.sent_at = guestData.sentAt || guestData.sent_at;
      updatePayload.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("guests")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return {
          _id: data.id,
          name: data.name,
          phone: data.phone,
          status: data.status,
          sentAt: data.sent_at,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (err) {
      console.warn("Supabase update guest failed, using file fallback.", err);
    }
  }

  // Fallback to JSON file
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, "guests.json");
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    let guests = JSON.parse(fileData);
    const index = guests.findIndex((g: any) => g._id === id);
    if (index !== -1) {
      guests[index] = {
        ...guests[index],
        ...guestData,
        updatedAt: new Date().toISOString(),
      };
      await safeWriteFile(filePath, JSON.stringify(guests, null, 2));
      return guests[index];
    }
  } catch (e) {}
  return null;
}

export async function deleteDynamicGuest(id: string) {
  let guestName = "";
  if (!id.startsWith("json_")) {
    try {
      // Get guest name before deleting
      const { data: guestData } = await supabase
        .from("guests")
        .select("name")
        .eq("id", id)
        .single();
      if (guestData) guestName = guestData.name;

      const { error } = await supabase
        .from("guests")
        .delete()
        .eq("id", id);

      if (!error) {
        if (guestName) {
          // Cascade delete to wishes
          await supabase.from("wishes").delete().eq("name", guestName);
        }
        return { _id: id };
      }
    } catch (err) {
      console.warn("Supabase delete guest failed, using file fallback.", err);
    }
  }

  // Fallback to JSON file
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, "guests.json");
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    let guests = JSON.parse(fileData);
    
    const guestToDelete = guests.find((g: any) => g._id === id);
    if (guestToDelete) guestName = guestToDelete.name;

    const filtered = guests.filter((g: any) => g._id !== id);
    await safeWriteFile(filePath, JSON.stringify(filtered, null, 2));

    if (guestName) {
      // Cascade delete to wishes JSON
      const wishesPath = path.join(DATA_DIR, "wishes.json");
      try {
        const wishesData = await fs.readFile(wishesPath, "utf-8");
        let wishes = JSON.parse(wishesData);
        wishes = wishes.filter((w: any) => w.name !== guestName);
        await safeWriteFile(wishesPath, JSON.stringify(wishes, null, 2));
      } catch (e) {}
    }

    return { _id: id };
  } catch (e) {}
  return null;
}

export async function deleteDynamicGuestBulk(ids: string[]) {
  const supabaseIds = ids.filter(id => !id.startsWith("json_"));
  const jsonIds = ids.filter(id => id.startsWith("json_"));

  if (supabaseIds.length > 0) {
    try {
      // Get guest names before deleting
      const { data: guestsData } = await supabase
        .from("guests")
        .select("name")
        .in("id", supabaseIds);
      const guestNames = guestsData?.map(g => g.name) || [];

      await supabase
        .from("guests")
        .delete()
        .in("id", supabaseIds);

      if (guestNames.length > 0) {
        // Cascade delete to wishes
        await supabase
          .from("wishes")
          .delete()
          .in("name", guestNames);
      }
    } catch (err) {
      console.warn("Supabase bulk delete guest failed.", err);
    }
  }

  // Fallback to JSON file
  if (jsonIds.length > 0) {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, "guests.json");
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      let guests = JSON.parse(fileData);
      
      const guestNames = guests.filter((g: any) => jsonIds.includes(g._id)).map((g: any) => g.name);

      const filtered = guests.filter((g: any) => !jsonIds.includes(g._id));
      await safeWriteFile(filePath, JSON.stringify(filtered, null, 2));

      if (guestNames.length > 0) {
        // Cascade delete to wishes JSON
        const wishesPath = path.join(DATA_DIR, "wishes.json");
        try {
          const wishesData = await fs.readFile(wishesPath, "utf-8");
          let wishes = JSON.parse(wishesData);
          wishes = wishes.filter((w: any) => !guestNames.includes(w.name));
          await safeWriteFile(wishesPath, JSON.stringify(wishes, null, 2));
        } catch (e) {}
      }
    } catch (e) {}
  }
  return { deleted: true };
}

// ============ WISHES / RSVP ============

export async function getDynamicWishes(page: number, limit: number) {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("wishes")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error && data) {
      const totalWishes = count || 0;
      return {
        wishes: data.map((w: any) => ({
          _id: w.id,
          name: w.name,
          attendance: w.attendance,
          guests: w.guests,
          message: w.message,
          createdAt: w.created_at,
          updatedAt: w.updated_at,
        })),
        totalPages: Math.ceil(totalWishes / limit),
        currentPage: page,
      };
    }
  } catch (err) {
    console.warn("Supabase fetch wishes failed, using file fallback.", err);
  }

  // Fallback to JSON file
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, "wishes.json");
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    const wishes = JSON.parse(fileData);
    const totalWishes = wishes.length;
    const paginated = wishes.slice((page - 1) * limit, page * limit);
    return {
      wishes: paginated,
      totalPages: Math.ceil(totalWishes / limit),
      currentPage: page,
    };
  } catch (e) {
    return { wishes: [], totalPages: 0, currentPage: page };
  }
}

// Cari RSVP/ucapan yang sudah ada berdasarkan nama (untuk konfirmasi sebelum update)
export async function findWishByName(name: string) {
  try {
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .eq("name", name)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (!error) {
      const w = data?.[0];
      if (!w) return null;
      return {
        _id: w.id,
        name: w.name,
        attendance: w.attendance,
        guests: w.guests,
        message: w.message,
        createdAt: w.created_at,
        updatedAt: w.updated_at,
      };
    }
  } catch (err) {
    console.warn("Supabase find wish failed, using file fallback.", err);
  }

  // Fallback to JSON file
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, "wishes.json");
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    const wishes = JSON.parse(fileData);
    return wishes.find((w: any) => w.name === name) ?? null;
  } catch (e) {
    return null;
  }
}

export async function createDynamicWish(rawWishData: any) {
  // Normalisasi jumlah tamu: "Tidak Hadir" selalu 0.
  // Jangan pakai `guests || 1` karena 0 dianggap falsy → berubah jadi 1.
  const attendance = rawWishData.attendance || "Hadir";
  const parsedGuests = Number(rawWishData.guests);
  const wishData = {
    ...rawWishData,
    attendance,
    guests:
      attendance === "Tidak Hadir"
        ? 0
        : Number.isFinite(parsedGuests) && parsedGuests > 0
        ? parsedGuests
        : 1,
  };

  try {
    // Check if wish from same person already exists (upsert logic)
    // Use .limit(1) instead of .single() to avoid crash when duplicates exist
    const { data: existingList } = await supabase
      .from("wishes")
      .select("*")
      .eq("name", wishData.name)
      .limit(1);

    const existing = existingList?.[0] ?? null;

    if (existing) {
      const updatePayload: any = {
        attendance: wishData.attendance,
        guests: wishData.guests,
        updated_at: new Date().toISOString(),
      };
      if (wishData.message?.trim()) updatePayload.message = wishData.message;

      const { data, error } = await supabase
        .from("wishes")
        .update(updatePayload)
        .eq("id", existing.id)
        .select()
        .single();

      if (!error && data) {
        return {
          _id: data.id,
          name: data.name,
          attendance: data.attendance,
          guests: data.guests,
          message: data.message,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } else {
      const { data, error } = await supabase
        .from("wishes")
        .insert({
          name: wishData.name,
          attendance: wishData.attendance,
          guests: wishData.guests,
          message: wishData.message || "",
        })
        .select()
        .single();

      if (!error && data) {
        return {
          _id: data.id,
          name: data.name,
          attendance: data.attendance,
          guests: data.guests,
          message: data.message,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    }
  } catch (err) {
    console.warn("Supabase create wish failed, using file fallback.", err);
  }

  // Fallback to JSON file
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, "wishes.json");
  let wishes: any[] = [];
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    wishes = JSON.parse(fileData);
  } catch (e) {}

  const existingIndex = wishes.findIndex((w: any) => w.name === wishData.name);
  if (existingIndex !== -1) {
    wishes[existingIndex].attendance = wishData.attendance;
    wishes[existingIndex].guests = wishData.guests;
    if (wishData.message?.trim()) wishes[existingIndex].message = wishData.message;
    wishes[existingIndex].updatedAt = new Date().toISOString();
    const [updatedWish] = wishes.splice(existingIndex, 1);
    wishes.unshift(updatedWish);
    await safeWriteFile(filePath, JSON.stringify(wishes, null, 2));
    return updatedWish;
  }

  const newWish = {
    _id: `json_${Date.now()}`,
    ...wishData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  wishes.unshift(newWish);
  await safeWriteFile(filePath, JSON.stringify(wishes, null, 2));
  return newWish;
}

// Hapus pesan ucapan saja, RSVP (kehadiran) tetap tersimpan
export async function clearWishMessage(id: string) {
  if (!id.startsWith("json_")) {
    try {
      const { data, error } = await supabase
        .from("wishes")
        .update({ message: "", updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (!error && data) return { _id: data.id };
    } catch (err) {
      console.warn("Supabase clear wish message failed.", err);
    }
  }

  // Fallback JSON: kosongkan message
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, "wishes.json");
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    const wishes = JSON.parse(fileData);
    const index = wishes.findIndex((w: any) => w._id === id);
    if (index !== -1) {
      wishes[index].message = "";
      await safeWriteFile(filePath, JSON.stringify(wishes, null, 2));
      return { _id: id };
    }
  } catch (e) {}
  return null;
}

export async function clearWishMessageBulk(ids: string[]) {
  const supabaseIds = ids.filter((id) => !id.startsWith("json_"));
  const jsonIds = ids.filter((id) => id.startsWith("json_"));

  if (supabaseIds.length > 0) {
    try {
      await supabase
        .from("wishes")
        .update({ message: "", updated_at: new Date().toISOString() })
        .in("id", supabaseIds);
    } catch (err) {
      console.warn("Supabase bulk clear wish message failed.", err);
    }
  }

  if (jsonIds.length > 0) {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, "wishes.json");
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      const wishes = JSON.parse(fileData);
      wishes.forEach((w: any) => { if (jsonIds.includes(w._id)) w.message = ""; });
      await safeWriteFile(filePath, JSON.stringify(wishes, null, 2));
    } catch (e) {}
  }
  return { cleared: true };
}

export async function deleteDynamicWish(id: string) {
  if (!id.startsWith("json_")) {
    try {
      const { error } = await supabase
        .from("wishes")
        .delete()
        .eq("id", id);

      if (!error) return { _id: id };
    } catch (err) {
      console.warn("Supabase delete wish failed.", err);
    }
  }

  // Fallback to JSON file
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, "wishes.json");
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    let wishes = JSON.parse(fileData);
    wishes = wishes.filter((w: any) => w._id !== id);
    await safeWriteFile(filePath, JSON.stringify(wishes, null, 2));
    return { _id: id };
  } catch (e) {}
  return null;
}

export async function deleteDynamicWishBulk(ids: string[]) {
  const supabaseIds = ids.filter(id => !id.startsWith("json_"));
  const jsonIds = ids.filter(id => id.startsWith("json_"));

  if (supabaseIds.length > 0) {
    try {
      await supabase
        .from("wishes")
        .delete()
        .in("id", supabaseIds);
    } catch (err) {
      console.warn("Supabase bulk delete wish failed.", err);
    }
  }

  // Fallback to JSON file
  if (jsonIds.length > 0) {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, "wishes.json");
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      let wishes = JSON.parse(fileData);
      wishes = wishes.filter((w: any) => !jsonIds.includes(w._id));
      await safeWriteFile(filePath, JSON.stringify(wishes, null, 2));
    } catch (e) {}
  }
  return { deleted: true };
}

export async function clearDynamicWishes() {
  try {
    const { error } = await supabase
      .from("wishes")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all rows

    if (!error) {
      // Also clear JSON fallback
      await ensureDataDir();
      const filePath = path.join(DATA_DIR, "wishes.json");
      await safeWriteFile(filePath, JSON.stringify([], null, 2));
      return true;
    }
  } catch (err) {
    console.warn("Supabase clear wishes failed.", err);
  }

  // Fallback to JSON file
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, "wishes.json");
  try {
    await safeWriteFile(filePath, JSON.stringify([], null, 2));
    return true;
  } catch (e) {}
  return false;
}
