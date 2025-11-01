import { json } from '@sveltejs/kit';
import * as cheerio from 'cheerio';


function parseBerita(htmlString) {
    const $ = cheerio.load(htmlString);
    const newsList = [];

    // Selector untuk setiap item artikel
    $('.articles--iridescent-list--item').each((index, element) => {
        const article = $(element);

        const titleElement = article.find('.articles--iridescent-list--text-item__title-link');
        const title = titleElement.text().trim();
        const url = titleElement.attr('href');
        const category = article.find('.articles--iridescent-list--text-item__category').text().trim();

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

export async function GET({ url }) {
    const searchParams = url.searchParams;
    const nama = url.searchParams.get('nama');
    try {

        const reuslt = await getBerita(nama);
        if (reuslt) {
            return json(reuslt);
        } else {
            return json({ error: 'Gagal mengambil data berita.' }, { status: 500 });
        }

    } catch (err) {
        console.error('Error saat scraping:', err);
        return json({ error: err }, { status: 500 });
    }
}