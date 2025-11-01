// src/routes/api/kabinet/+server.js

import { json } from '@sveltejs/kit';
import * as cheerio from 'cheerio';


function bersihkanTeks(htmlString) {
    // 1. Mendekode string (agar \u003C menjadi <, \u003E menjadi >)
    // Ini terjadi secara implisit ketika string ini diinisialisasi di JS.
    // Untuk memastikan, kita bisa menggunakan JSON.parse jika teks awalnya dari JSON.
    // Dalam kasus ini, kita bisa memanfaatkan DOMParser.

    // 2. Menggunakan DOMParser untuk membuat dokumen virtual
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // 3. Mengambil konten teks dari body dokumen
    // innerText akan lebih baik dalam memformat spasi dan baris baru
    let teksBersih = doc.body.textContent || "";

    // Membersihkan spasi berlebih yang mungkin muncul dari penghapusan tag
    teksBersih = teksBersih.replace(/\s+/g, ' ').trim();

    return teksBersih;
}

function parseBerita(htmlString) {
    const $ = cheerio.load(htmlString);
    const newsList = [];

    // Selector untuk setiap item artikel
    $('.articles--iridescent-list--item').each((index, element) => {
        console.log(index);
        const article = $(element);

        // Ambil Judul, URL, Kategori, dan Tgl Publikasi
        const titleElement = article.find('.articles--iridescent-list--text-item__title-link');
        const title = titleElement.text().trim();
        const url = titleElement.attr('href');
        const category = article.find('.articles--iridescent-list--text-item__category').text().trim();

        // Ambil Tanggal ISO 8601 (lebih akurat daripada teks "5 bulan lalu")
        const datetimeAttribute = article.find('.articles--iridescent-list--text-item__time').attr('datetime');
        const dateText = article.find('.articles--iridescent-list--text-item__time').attr('title');

        // Ambil URL Thumbnail
        const thumbnailElement = article.find('.articles--iridescent-list--text-item__figure-image-img');
        const thumbnailUrl = thumbnailElement.attr('src');

        // Ambil ringkasan
        const summary = article.find('.articles--iridescent-list--text-item__summary-seo').text().trim().replace(/^\.\.\.\s*/, ''); // Hapus ellipsis dan spasi di awal

        newsList.push({
            judul: title,
            url: url,
            kategori: category,
            tanggal_iso: datetimeAttribute,
            tanggal_teks: dateText,
            thumbnail_url: thumbnailUrl,
            ringkasan: summary
        });
    });

    return newsList;
}

async function getBerita(nama) {

    console.log(`https://www.liputan6.com/search?q=${nama}`);



    const response = await fetch(`https://www.liputan6.com/search?q=${nama}`, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-GB,en;q=0.9,en-US;q=0.8,id;q=0.7",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Microsoft Edge\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": "js_enabled=true; js_enabled=true; user_token=YFkJ9RMqH7EuSwuEkBNNjUNLsr5BKZTwHHFSx2Uy; smartsearch_user=0d8c2453-1df2-49dc-bb2d-76527806f29a; google_tap_signin_dialog_today=1; g_state={\"i_l\":1,\"i_ll\":1761937799286,\"i_b\":\"T3Wq8HZwtnWy2gpIq5iVBF4dOG5rNEW6X7DlnqjwWho\",\"i_p\":1761945007640}; popoverSearchResultClosed=true; readArticle=%5B6002062%5D; upgraded_laravel_session=eyJpdiI6IncrY0ZBS1wvclZCTUlpanVPWjlaMWxBPT0iLCJ2YWx1ZSI6Im9NTmc1ZW5iYTZHd0JCUWZ1Zk9RcUlJekpxeE9tVkhjTDNHK1Y1Uk9LNUdnR3JhNGpHRGtGNU1ZOUgzZisyNmp1a1ZhWDJoS0dLQjNEbng3Z0NlQlwvZz09IiwibWFjIjoiMDFkYWY5NDk2MzFhNjU2MGRlNzQ1MjYzMjMxZTM1NmIzMzA1MTlkYTAwZTY0ZTc0MzEzZGI4YWRjMTc0MWRjMyJ9"
        },
        "body": null,
        "method": "GET"
    });
    const html = await response.text();

    const data = parseBerita(html);
    return data;
}



async function scrapeWikipediaProfile(nama) {
    try {
        const berita = await getBerita(nama);

        const url = `https://id.wikipedia.org/wiki/${encodeURIComponent(nama.replace(/ /g, '_'))}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        //hapus script dan style
        $("style, script, noscript").remove();

        const result = {
            profil: {},
            seksi_konten: {},
            berita: berita
        };

        const infobox = $('table.infobox');

        if (infobox.length) {
            result.profil.nama = $('#firstHeading').text().trim();
            infobox.find('tr').each((i, el) => {
                const header = $(el).find('th').text().trim();
                const td = $(el).find('td').first();

                if (header && td.length) {
                    const cleanHeader = header.replace(/\[\d+\]/g, '').trim();
                    const key = cleanHeader.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

                    let data;
                    const listItems = td.find('li');

                    if (listItems.length > 0) {
                        data = listItems.map((j, li) => {
                            return $(li).text().replace(/\[\d+\]/g, '').trim();
                        }).get();
                    } else {
                        data = td.text().trim();
                        data = data.replace(/\[\d+\]/g, '').trim(); // Bersihkan catatan kaki
                    }

                    if (key && data) {
                        result.profil[key] = data;
                    }
                }
            });
            const imageElement = infobox.find('.infobox-image img').first();
            result.profil.gambar = imageElement.attr('src') ? `https:${imageElement.attr('src')}` : null;
        }

        const contentArea = $('#mw-content-text > div.mw-parser-output');

        let currentSectionTitle = 'Pendahuluan';
        let currentSectionContent = [];

        contentArea.children().each((i, el) => {
            const element = $(el);
            if (element.is('div.mw-heading.mw-heading2')) {
                if (currentSectionContent.length > 0) {
                    result.seksi_konten[currentSectionTitle] = currentSectionContent;
                }
                let rawTitle = element.find('h2').text().trim();
                currentSectionTitle = rawTitle.replace(/\[sunting\]/g, '').trim();
                currentSectionContent = []; // Reset konten untuk bagian baru

            } else if (element.is('p')) {
                let text = element.text().trim();
                text = text.replace(/\[\d+\]/g, '').trim();

                if (text) {
                    currentSectionContent.push(text);
                }
            }
        });

        if (currentSectionContent.length > 0) {
            result.seksi_konten[currentSectionTitle] = currentSectionContent;
        }

        return result;

    } catch (error) {
        console.error('Terjadi kesalahan saat scraping:', error.message);
        return null;
    }
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    const searchParams = url.searchParams;

    const nama = url.searchParams.get('nama');

    try {

        const reuslt = await scrapeWikipediaProfile(nama);
        if (reuslt) {
            return json(reuslt);
        } else {
            return json({ error: 'Gagal mengambil data profil.' }, { status: 500 });
        }

    } catch (error) {
        console.error('Error saat scraping:', error);
        return json({ error: 'Gagal memproses data profil.' }, { status: 500 });
    }
}