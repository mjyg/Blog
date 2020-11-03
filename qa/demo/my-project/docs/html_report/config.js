report({
  "testSuite": "BackstopJS",
  "tests": [
    {
      "pair": {
        "reference": "../../backstop_data/bitmaps_reference/qq_BackstopJS_Homepage_0_document_0_phone.png",
        "test": "../../backstop_data/bitmaps_test/20201102-210741/qq_BackstopJS_Homepage_0_document_0_phone.png",
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
          "misMatchPercentage": "13.90",
          "analysisTime": 25
        },
        "diffImage": "../../backstop_data/bitmaps_test/20201102-210741/failed_diff_qq_BackstopJS_Homepage_0_document_0_phone.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "../../backstop_data/bitmaps_reference/qq_BackstopJS_Homepage_0_document_1_tablet.png",
        "test": "../../backstop_data/bitmaps_test/20201102-210741/qq_BackstopJS_Homepage_0_document_1_tablet.png",
        "selector": "document",
        "fileName": "qq_BackstopJS_Homepage_0_document_1_tablet.png",
        "label": "BackstopJS Homepage",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "https://map.qq.com/m/",
        "referenceUrl": "",
        "expect": 0,
        "viewportLabel": "tablet",
        "error": "Reference file not found /Users/jie/Desktop/project/git/FrontendLearning/6.8qa/my-project/backstop_data/bitmaps_reference/qq_BackstopJS_Homepage_0_document_1_tablet.png"
      },
      "status": "fail"
    }
  ],
  "id": "qq"
});