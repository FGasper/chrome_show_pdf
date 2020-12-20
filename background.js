chrome.webRequest.onHeadersReceived.addListener(
  function(info) {
    let headers = info.responseHeaders;

    let disposition_hdr_idx = -1;
    let is_pdf;
    let hdrname;

  HEADER:
    for (let h=0; h<headers.length; h++) {
        hdrname = headers[h].name.toLowerCase();

        switch (hdrname) {
            case "content-disposition":
                disposition_hdr_idx = h;
                if (is_pdf) break HEADER;
                break;

            case "content-type":
                if (headers[h].value !== "application/pdf") return;
                is_pdf = true;
                if (disposition_hdr_idx !== -1) break HEADER;
        }

    }

    if (is_pdf && (disposition_hdr_idx > -1)) {
        let new_headers = headers.slice(0);
        new_headers.splice(disposition_hdr_idx, 1);
        return { responseHeaders: new_headers };
    }
  },

  // filters
  {
    "urls": [
        "http://*/*",
        "https://*/*",
    ],
  },

  // extraInfoSpec
  [
    "blocking",
    "responseHeaders",
  ]
);
