// const shortid = require("shortid");
// const UrlModel = require("../models/url");

// async function handleGenerateNewShortURL(req, res) {
//   const redirectURL = req.body.redirectURL;

//   if (!redirectURL) return res.status(400).json({ error: "url is required" });

//   const shortenedURL = shortid.generate();

//   await UrlModel.create({
//     shortId: shortenedURL,
//     redirectURL,
//     visitHistory: [],
//   });
//   return res.render("shortened", { shortenedURL, redirectURL });
//   //return res.render("home") --> as we also have to pass url @ that how props work --> so render separately in shortened.ejs
//   return res.status(201).json({ id: shortenedURL });
// }

// // bit.ly/url/Nptc6xb4R
// // async function handleRedirect(req, res) {
// //   const shortId = req.params.shortId; //path
// //   const entry = await UrlModel.findOne({
// //     shortId,
// //   });
// //   res.redirect(entry.redirectURL);
// // }

// async function handleRedirectURL(req,res) {
//   const {shortId} = req.params;
//   try {
//     const entry = await UrlModel.findOneAndUpdate(
//       { shortId },
//       {
//         $push: {
//           visitHistory: {
//             timestamp: Date.now(),
//             userDevice: req.headers["user-agent"] || "Unknown",
//           },
//         },
//       }
//     );
//     if (!entry) {
//       return res.status(404).json({ error: "Short URL not found"});
//     }
//     let targetURL = entry.redirectURL.trim();
//     if(!targetURL.startsWith("http://") && !targetURL.startsWith("https://")) {
//       targetURL = `https://${targetURL}`;
//     }
//     return res.redirect(targetURL);
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// }

// async function handleRenderAnalyticsUI(req, res) {
//   const { shortId } = req.params;

//   try {
//     const result = await URL.findOne({ shortId });
//     if (!result) {
//       return res.status(404).send("<h2>Short URL not found</h2>");
//     }

//     // Build table rows from visitHistory
//     const rows = result.visitHistory
//       .map(
//         (visit, index) => `
//         <tr>
//           <td style="border: 1px solid #ccc; padding: 8px;">${index + 1}</td>
//           <td style="border: 1px solid #ccc; padding: 8px;">${new Date(visit.timestamp).toLocaleString()}</td>
//           <td style="border: 1px solid #ccc; padding: 8px;">${visit.userDevice || "Desktop / Postman"}</td>
//         </tr>
//       `
//       )
//       .join("");

//     // Return the HTML page
//     const html = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Analytics for ${shortId}</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; }
//             table { border-collapse: collapse; width: 100%; margin-top: 15px; }
//             th { border: 1px solid #ccc; padding: 8px; background: #f2f2f2; text-align: left; }
//           </style>
//         </head>
//         <body>
//           <h2>URL Analytics: ${shortId}</h2>
//           <p><strong>Original URL:</strong> <a href="${result.redirectURL}" target="_blank">${result.redirectURL}</a></p>
//           <p><strong>Total Clicks:</strong> ${result.visitHistory.length}</p>

//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Visited At (Date & Time)</th>
//                 <th>Client User-Agent</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${rows || '<tr><td colspan="3" style="text-align: center; padding: 12px;">No visits recorded yet.</td></tr>'}
//             </tbody>
//           </table>
//         </body>
//       </html>
//     `;

//     return res.send(html);
//   } catch (err) {
//     return res.status(500).send("Error rendering analytics page");
//   }
// }



// module.exports = {
//   handleGenerateNewShortURL,
//   //handleRedirect,
//   handleRedirectURL,
//   handleRenderAnalyticsUI,
// };



// controllers/url.js
const shortid = require("shortid");
const UrlModel = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const redirectURL = req.body.redirectURL;
  if (!redirectURL) return res.status(400).json({ error: "url is required" });

  const shortenedURL = shortid.generate();
  await UrlModel.create({
    shortId: shortenedURL,
    redirectURL,
    visitHistory: [],
  });

  // Query existing URLs so home.ejs has data for its list/table
  const allUrls = await UrlModel.find({});

  // Merge: Render 'home' directly with the new ID and updated list
  return res.render("home", {
    id: shortenedURL,
    urls: allUrls,
  });
}

async function handleRedirectURL(req, res) {
  const { shortId } = req.params;
  try {
    const entry = await UrlModel.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
            userDevice: req.headers["user-agent"] || "Unknown",
          },
        },
      }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    let targetURL = entry.redirectURL.trim();
    if (!targetURL.startsWith("http://") && !targetURL.startsWith("https://")) {
      targetURL = `https://${targetURL}`;
    }

    return res.redirect(targetURL);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleRenderAnalyticsUI(req, res) {
  const { shortId } = req.params;
  try {
    // FIX BUG 1: Changed URL.findOne to UrlModel.findOne
    const result = await UrlModel.findOne({ shortId });
    if (!result) {
      return res.status(404).send("<h2>Short URL not found</h2>");
    }

    const rows = result.visitHistory
      .map(
        (visit, index) => `
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">${index + 1}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">${new Date(visit.timestamp).toLocaleString()}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">${visit.userDevice || "Desktop / Postman"}</td>
      </tr>
    `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Analytics - ${shortId}</title>
        <style>
          table { border-collapse: collapse; width: 100%; margin-top: 15px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>URL Analytics: ${shortId}</h2>
        <p><strong>Original URL:</strong> <a href="${result.redirectURL}" target="_blank">${result.redirectURL}</a></p>
        <p><strong>Total Clicks:</strong> ${result.visitHistory.length}</p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Visited At (Date & Time)</th>
              <th>Client User-Agent</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="3" style="text-align: center; padding: 12px;">No visits recorded yet.</td></tr>'}
          </tbody>
        </table>
      </body>
      </html>
    `;

    return res.send(html);
  } catch (err) {
    return res.status(500).send("Error rendering analytics page");
  }
}

module.exports = {
  handleGenerateNewShortURL,
  handleRedirectURL,
  handleRenderAnalyticsUI,
};