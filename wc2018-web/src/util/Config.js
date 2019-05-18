
const firebaseYear = "2018";
const firebaseEnv = "prod";

export const Config = {
    firebaseEnv: firebaseEnv,
    firebaseYear: firebaseYear,
    firebaseBasePath: `${firebaseYear}/${firebaseEnv}`,
    firebaseBaseUrl: `https://wc2018-2bad0.firebaseio.com/${firebaseYear}/${firebaseEnv}`,
    apiBaseUrl: "https://wc2018-api.faziodev.org/"
    //apiBaseUrl: "http://localhost:8080/"
};