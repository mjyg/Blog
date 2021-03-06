report({
  "testSuite": "BackstopJS",
  "tests": [
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\qq_BackstopJS_Homepage_0_document_0_phone.png",
        "test": "..\\bitmaps_test\\20200609-230211\\qq_BackstopJS_Homepage_0_document_0_phone.png",
        "selector": "document",
        "fileName": "qq_BackstopJS_Homepage_0_document_0_phone.png",
        "label": "BackstopJS Homepage",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "https://map.qq.com/m/",
        "referenceUrl": "",
        "expect": 0,
        "viewportLabel": "phone",
        "diff": {
          "isSameDimensions": false,
          "dimensionDifference": {
            "width": -55,
            "height": -187
          },
          "misMatchPercentage": "14.23",
          "analysisTime": 21
        },
        "diffImage": "..\\bitmaps_test\\20200609-230211\\failed_diff_qq_BackstopJS_Homepage_0_document_0_phone.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\qq_BackstopJS_Homepage_0_document_1_tablet.png",
        "test": "..\\bitmaps_test\\20200609-230211\\qq_BackstopJS_Homepage_0_document_1_tablet.png",
        "selector": "document",
        "fileName": "qq_BackstopJS_Homepage_0_document_1_tablet.png",
        "label": "BackstopJS Homepage",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "https://map.qq.com/m/",
        "referenceUrl": "",
        "expect": 0,
        "viewportLabel": "tablet",
        "error": "Reference file not found C:\\Users\\hiwgd\\Desktop\\jie\\code\\6.8_lesson\\backstop_data\\bitmaps_reference\\qq_BackstopJS_Homepage_0_document_1_tablet.png"
      },
      "status": "fail"
    }
  ],
  "id": "qq"
});