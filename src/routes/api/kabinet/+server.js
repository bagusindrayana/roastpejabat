import { json } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const urlTarget = 'https://setkab.go.id/profil-kabinet';
    const allScrapedData = []; 

    try {
        const response = await fetch(urlTarget);
        if (!response.ok) {
            throw new Error(`Gagal mengambil data: ${response.status}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);
        
        $('table.wikitable').each((i, tableElement) => {

            $(tableElement).find('tbody tr').each((index, element) => {
                const columns = $(element).find('td');
                
                if (columns.length > 4) { 
                    
                    const no = $(columns[0]).text().trim();
                    const jabatan = $(columns[1]).find('a').text().trim() || $(columns[1]).text().trim();
                    const foto = $(columns[2]).find('img').attr('src');
                    const pejabat = $(columns[3]).text().trim();
                    
                    let mulai = columns.length > 4 ? $(columns[4]).text().trim() : '';
                    let selesai = columns.length > 5 ? $(columns[5]).text().trim() : '';
                    
                    allScrapedData.push({
                        no: no,
                        jabatan: jabatan,
                        nama_pejabat: pejabat,
                        foto_url: foto ? new URL(foto, urlTarget).href : null,
                        mulai_menjabat: mulai,
                        selesai_menjabat: selesai
                    });
                } else if(columns.length == 4) {
                    const imgElm = $(columns[0]).find('img');
                    if(imgElm.length > 0) {
                        const foto = imgElm.attr('src');
                        const pejabat = $(columns[1]).text().trim();
                        
                        let mulai = $(columns[2]).text().trim();
                        let selesai = $(columns[3]).text().trim();
                        
                        allScrapedData.push({
                            no: index+1,
                            jabatan: "-",
                            nama_pejabat: pejabat,
                            foto_url: foto ? new URL(foto, urlTarget).href : null,
                            mulai_menjabat: mulai,
                            selesai_menjabat: selesai
                        });
                    } else if($(columns[0]).text().trim() == "Prabowo Subianto"){
                        allScrapedData.push({
                            no: 1,
                            jabatan: "Presiden",
                            nama_pejabat: $(columns[0]).text().trim(),
                            foto_url: new URL($(columns[1]).find('img').attr('src'), urlTarget).href,
                            mulai_menjabat: "-",
                            selesai_menjabat: "-"
                        });

                        allScrapedData.push({
                            no: 2,
                            jabatan: "Wakil Presiden",
                            nama_pejabat: $(columns[3]).text().trim(),
                            foto_url: new URL($(columns[2]).find('img').attr('src'), urlTarget).href,
                            mulai_menjabat: "-",
                            selesai_menjabat: "-"
                        });
                    }
                    
                }
            });
        });

        return json(allScrapedData);

    } catch (error) {
        console.error('Error saat scraping:', error);
        return json({ error: 'Gagal memproses data kabinet.' }, { status: 500 });
    }
}