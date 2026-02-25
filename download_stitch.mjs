import fs from 'fs';
import https from 'https';
import path from 'path';

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (res) => {
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on('finish', () => { file.close(resolve); });
        }).on('error', reject);
      } else {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => { file.close(resolve); });
      }
    }).on('error', reject);
  });
};

const screens = [
  {
    title: "Product Inventory Management",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2VhMjRkY2Y4NTVkMDQ3N2ZhMGY0MmFlZmNmMGFmMzc4EgsSBxCb58XIxQoYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTA5MDAwMjIyMzA4MTM0NTg0&filename=&opi=89354086",
    img: "https://lh3.googleusercontent.com/aida/AOfcidWApBldOfYFFZESNhB_QEJZuvvr-hjPwUNUCPJy-RJmY_FRISGkTM6Dtr-n_d-VtUsMLxdPThl3FqIEENj0v4jmtDy2dGOLuxUuYJ1HUv1bip-UU6MDoShBX6ATw1vzBMvIIZOH0A0EkUTwhhtaAJ6CfEn8i_lRKxG5I-Eht5xg-Ye63IzNb3WJlnZM1OinR_B3JO38M-PAUtJxv4jyOSFU5oWQ46mM7QuT9phsuIYVKXchdYmK4dHe8WU"
  },
  {
    title: "Sales Reports & Analytics",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAyNzkxNTUyYTNmNTQ5MWU5YjIxZjUxMTAxMmQ2OTM2EgsSBxCb58XIxQoYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTA5MDAwMjIyMzA4MTM0NTg0&filename=&opi=89354086",
    img: "https://lh3.googleusercontent.com/aida/AOfcidW7AljhwwJKCbO-K2WskYj660uiaKQ3rGU1yhS8fuhwYIZlIK5o4CsUpcdQqJB64hQ0jT_1xrxxItVXwOA9stD8lHAFDnQRIB4gMUc5CC_UM4loTC2m9URZgV70Slaukh3YmJE9ruEUSuXSjau5htvZdE-bu2VXbwPKyoneAAYAfBo-Gm8GsfKnE59iBDcqiexlnVhbT_bZ7TAE_Hw1L7ue35CA5selpE2UlAIbUNH7Hkp-B2JVo_cWrGw"
  },
  {
    title: "Invoice Print Preview",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzU2MjAzNmRhYTYxZDQ2MmY5ZTY0MTZkZTkyYjU5ODY5EgsSBxCb58XIxQoYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTA5MDAwMjIyMzA4MTM0NTg0&filename=&opi=89354086",
    img: "https://lh3.googleusercontent.com/aida/AOfcidXteWrYV5wo_oTP0KRtAGY9sUgGPkPRK80UUavY0chWsn1O75emCY8mNYQmMFQ6gJZyTtEl3P2NSNrhzcaai60VD-Sa4uK3aMpXnjp2-pPrZQwtRHoZQb-x5fh3pwA-l9dZuY_ZbUkluWM0B8oyKagWMSIFCJJ50UBUNyiRq4aodLurDkacKvOnViaRq67rw8OKOiagvwWZtH7swzaF7Cxhrl0h9LbFdvyaLYQVMZNLH2zcOxNdfe0-GFk"
  },
  {
    title: "Add Edit Product Modal",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzRiNWU3ZmJkZGVkODRiMDJiYjY4ZDgzMmM2ZDRiOTY5EgsSBxCb58XIxQoYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTA5MDAwMjIyMzA4MTM0NTg0&filename=&opi=89354086",
    img: "https://lh3.googleusercontent.com/aida/AOfcidVVIfpuJW_gEjRPz1YTwvRddkiWf1RjVNtM-kNEynyy-KDxAMxIVTdKS2K96q0FwchXyCDGVj4WKAVecYbQBE-481kgVLe-SjGTFKZXBpyebOJ68q1bDaXtL-V4H16r8X8e03PVgTteKgQxL65hRytY2vhdtQxsgsVkG1jAATPMD3BXzBwZkriOWNbD8VfPsXuQV1pj9nOey9J2iKwAqF1m0MQQJlpJN9d4pKcieiMTvULy0LrNZzBjAKk"
  },
  {
    title: "Dashboard Overview",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2YzOGQ5ZjFhZDdkYzQxOTY5ZTMzODI3NDNmMTk4OWFlEgsSBxCb58XIxQoYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTA5MDAwMjIyMzA4MTM0NTg0&filename=&opi=89354086",
    img: "https://lh3.googleusercontent.com/aida/AOfcidVPqD4zQqURPE7euLqZ7grfG4Uv13LCv4j_MeEoyAwTbU9ZqKshiitDgqQW6fSSjzytkjhL_A33xz737vPQXZwEyG9RWIK7XRTpmcP1tMb4Z7rMN7SRenTtiAfHfsxgWd55RjHn9hkxW4I2D6stvFcNNtsxOdN9s4kmsU_d7pUg-cTTrIw7saHXt_ownqkeEkz7HqvV3Fb86qlzUoHrTX68qwwAypW925xNTVaodWc9nZ0cs_pNJ2E4_A"
  },
  {
    title: "System Settings",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2UwOWZlNTZlZTdlMDQ1ZGFhOThjYzg3M2QyNTA5YTBmEgsSBxCb58XIxQoYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTA5MDAwMjIyMzA4MTM0NTg0&filename=&opi=89354086",
    img: "https://lh3.googleusercontent.com/aida/AOfcidXCnajl_z-AMNNAuwABGiaF5bAXIY3o6dbNUNmtwAQKJzg2XePyQcE7rFGErk7-f2j5CSGklZM2e2ol5PiWIAPXTKiiPqYXP1adnH6ngIwi1Kx-IdV8XngADys1sGcuSFflEz-d168_gkKHb3nHqJzVezqcEVNyni-_hLqCgOlbpWm-Wmnb8_k6549Vm411zME0qJVctwPNfRex9u_-kLLUTVag3ZR6ZrWoxynTx-8hraAklJhmE0c1"
  },
  {
    title: "Billing Point of Sale",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzdlZGNjOGI3YzFjYjRiZWM4MTc0NTUxZTlkZTVjZjhjEgsSBxCb58XIxQoYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTA5MDAwMjIyMzA4MTM0NTg0&filename=&opi=89354086",
    img: "https://lh3.googleusercontent.com/aida/AOfcidWM0HPnfa7jFBAUyYx2sUsChtA8lkLEp8FxhNKJEWT-q1WD_btxQVmqQPyw_pLXqkOxcXLn5x9vkAnVqVx3GtR7BmnMPtWYBuYishaR4Jb-qs6FlekliVJrKld9ve1TB83oBkAOzbXD4jdyjoN1lBs_zgENXMf3GTb3QnMHMoPp2yZlFDHvh5A0QxaEqBqlPH5ZDwPvGdlt1cW5nCkYDqcbwOkhjJkMwSCGMkY3OxCG7dnqhumcg0B_8Gg"
  }
];

const main = async () => {
  for (const s of screens) {
    const title = s.title.replace(/[^a-zA-Z0-9]/g, '_');
    console.log(`Downloading ${title}...`);
    await downloadFile(s.html, path.join('src/assets/stitch', `${title}.html`));
    await downloadFile(s.img, path.join('src/assets/stitch', `${title}.png`));
  }
  console.log("Done");
};

main();
