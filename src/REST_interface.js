import axios from 'axios';

const host = 'https://gratissimum.duckdns.org:4443';
//const host = 'http://localhost:8000';
class REST_interface {
    static isBackendRunning() {
        return new Promise(((resolve, reject) =>
            axios.get(host).then((res) => {
                resolve(
                    res
                );
            }).catch((err) => {
                reject(err);
            })))
    }
    static login(user) {
        return new Promise(((resolve, reject) =>
            axios.post(host + '/login', user).then((res) => {
                resolve(
                    res
                );
            }).catch((err) => {
                reject(err);
            })))
    }
    static getCollection(collectionName) {
        return new Promise(((resolve, reject) =>
            axios.get(host + '/easyway/collection', {
                headers: {
                    'Collection': collectionName,
                    'Authorization': "Bearer " +
                        JSON.parse(localStorage.getItem('user')).accessToken,
                },
            }).then((res) => {
                resolve(
                    res
                );
            }).catch((err) => {
                reject(err);
            })))
    }
    static postToCollection(collectionName, item) {
        return new Promise(((resolve, reject) =>
            axios.post(host + '/easyway/add', item, {
                headers: {
                    'Collection': collectionName,
                    'Authorization': "Bearer " +
                        JSON.parse(localStorage.getItem('user')).accessToken,
                },
            }).then((res) => {
                resolve(
                    res
                );
            }).catch((err) => {
                reject(err);
            })))
    }
    static deleteItemInCollection(collectionName, itemId) {
        return new Promise(((resolve, reject) =>
            axios.delete(host + '/easyway/delete/' + itemId, {
                headers: {
                    'Collection': collectionName,
                    'Authorization': "Bearer " +
                        JSON.parse(localStorage.getItem('user')).accessToken,
                },
            }).then((res) => {
                resolve(
                    res
                );
            }).catch((err) => {
                reject(err);
            })))
    }
    static changeItemInCollection(collectionName, itemId, item) {
            return new Promise(((resolve, reject) =>
                axios.put(host + '/easyway/change/' + itemId, item, {
                    headers: {
                        'Collection': collectionName,
                        'Authorization': "Bearer " +
                            JSON.parse(localStorage.getItem('user')).accessToken,
                    }

                }).then((res) => {
                    resolve(
                        res
                    );
                }).catch((err) => {
                    reject(err);
                })))
        }
        // Get Excel sheet for Events
    static createEventExcel(fileName, event_ID) {
        return new Promise(((resolve, reject) =>
            axios.get(host + '/export/excel/event/' + event_ID, {
                responseType: 'arraybuffer',
                headers: {
                    'filename': fileName,
                    'Authorization': "Bearer " +
                        JSON.parse(localStorage.getItem('user')).accessToken,
                },
            }).then((res) => {
                resolve(
                    this.forceFileDownload(res, fileName)
                );
            }).catch((err) => {
                reject(err);
            })))
    }

    // Get Excel sheet for all Persons
    static createPersonExcel(fileName) {
        return new Promise(((resolve, reject) =>
            axios.get(host + '/export/excel/persons', {
                responseType: 'arraybuffer',
                headers: {
                    'filename': fileName,
                    'Authorization': "Bearer " +
                        JSON.parse(localStorage.getItem('user')).accessToken,
                },
            }).then((res) => {
                resolve(
                    this.forceFileDownload(res, fileName)
                );
            }).catch((err) => {
                reject(err);
            })))
    }

    static createStatisticExcel(fileName, eventNames, years) {
        return new Promise(((resolve, reject) =>

            axios.post(host + '/export/excel/statistic', {
                eventNames: eventNames,
                years: years
            }, {
                responseType: 'arraybuffer',
                headers: {
                    'filename': fileName,
                    'Authorization': "Bearer " +
                        JSON.parse(localStorage.getItem('user')).accessToken,
                },
            }).then((res) => {
                resolve(
                    this.forceFileDownload(res, fileName)
                );
            }).catch((err) => {
                reject(err);
            })))
    }

    static forceFileDownload(response, fileName) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName + '.xlsx') //or any other extension
        document.body.appendChild(link)
        link.click()
    }
}
export default REST_interface