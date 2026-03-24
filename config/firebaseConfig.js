import admin from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: "push-notification-system-aa1fd",
  private_key_id: "186fa0b48566ab93bea3e18091bdf2e6423be5ec",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC08xX8+nVwqBUI\nBaXROHVPVmrs7DsOJOODlZRS2QXgg4aSus7qjs5PHmAV2rnR7utLbqdZY3O1w1Gf\nmjvRE60hzDX8KAqLzWsLFdpRI8knN8U2mkz8yqk31De6jOwvqwHFz4i16fPX+T1j\nI9bYUgVn+nKukNwooWU+akrh1rCjTN1f+PyP1JMw6opDnecXA07hEX6WeiBF8jr+\nOTOZzZWD1mxdX9qNDYWx8JqXozZdwH1g74zUVTkWp4D4XYgrOqd1J2XvjPWtW3WN\nweb9Ov29XcqYkl1VRfxu1gBuqQjj2CDblvKRkGBZo0lzUAoBYQsHtEWvt4F3KeCZ\nP2ry032FAgMBAAECggEAIzRaFk5qM+FXuihTIvnvhOCEzBSHxtAxfYPICDhV9uDP\n+VMj96mSBP2dZxMXbPslRxc/stnxBK97/WfF9H72A6nV5PmrV5i/FziIsZmbRKiK\nk32Atfv94TFGKGLLftiv7xrZ976NJPtGULgD0DFhAOJOlpzzYGpKJtMKP5cD5bk2\nXn8M43VgcdjrcyxbxbXrRsouHXwHR75Qag8+TxT8vg3N+GahW7+BQHWm3FS56wU7\nJUDMtM8I5TjiXA44hq1HWBr+EvVZcvyyP2ZVH4bg05gn++47H5k0A718jr60RlSA\nyGete05+Sip6zXz6i4WSu7mtrtuWX7uZkILWx1BFMQKBgQDdb0571Krk21hueKj/\nUiOdwAWndJh3uRNAymzwJYz5sxeVsxow2p2fDsQGfEm+nAx1fMj/lizRwX4Zipct\nD+Y743Mu5DZD/wDQ6MzcDB966trAFAReTe/N97bmJBenAl0oFnuvTWu8ojdTB77w\n8563JSO4nFBjX0dkoRGvhlb6XQKBgQDRMfXL3Ilc6jfiOnOgYa+3dZqnkKrCxCck\nrdtVm5k+tFrPrInzp8x4ClhU0ovT257Yd9fEkxn72hSFiVRsdLWV5Sjz741/czj1\nS1lcOA1CQ2DymoPqiGYzgYWNjWlBvFx7SVlDydxZGEA0OEXWDfzULNf6qKokYZcb\nV/Nw31btSQKBgQCikrnYiIb/h1shoEzTR4cGppiAHUZjf+n2w6e/mJIsMaS7L8em\n3pqi0MBy0oWCACfVikw3+hXl2l2ueuYLG4U5qwBCCSMeQPZkascdN3lVUWBRbWDX\nq/jIC3qo9Q64ey/R4s/kIL9cuuxLdYBmfzaj2Ayl2X3bt3Q/GVJWwBbTsQKBgBjB\n3OD/fJIudeakHEMCzJTdqivihxL9u9QvbyG2hHBTT9v8A2d+mEgskT+Ym0u7VhUw\nOazd69lOeddD5WXgegz/TdVwqEJJFJiTDkRHreoFp1eOycXb1pyJ25BhB+/rptZA\nW/wVy6oPoKmNb1Zh2WYS2IyloV0k34kw43KcO+FhAoGAWvwMhV0ajgDjTlFda4HH\n6KQEjbbnkl+7BRGjBkc9nkQ3zoZmG4pa8YRigRvC2vmvo6aP6kdlL6FDCNGOcKlt\nRuuexGdmDhnicYF7yDdnfNAsQyy0nHwaicmF44SEG9JC3f2c38SiuKOdIoP6nQkc\nVpAxVXaVXFtTYVSuYa37N4c=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-fbsvc@push-notification-system-aa1fd.iam.gserviceaccount.com",
  client_id: "118070951226545356225",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40push-notification-system-aa1fd.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  console.log("[FIREBASE] Admin SDK already initialized");
}

export default admin;
