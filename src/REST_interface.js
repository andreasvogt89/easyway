import axios from 'axios';

const host = 'https://gratissimum.duckdns.org:4443';

class REST_interface {
    static isBackendRunning() {
        return new Promise(((resolve, reject) =>
            axios.get(host).then((res) => {
                resolve(
                    res.data
                );
            }).catch((err) => {
                reject(err);
            })))
    }
    static login(user) {
        return new Promise(((resolve, reject) =>
            axios.post(host + '/login', user).then((res) => {
                resolve(
                    res.data
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
                        sessionStorage.getItem('EAtoken'),
                },
            }).then((res) => {
                resolve(
                    res.data
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
                        sessionStorage.getItem('EAtoken'),
                },
            }).then((res) => {
                resolve(
                    res.data
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
                        sessionStorage.getItem('EAtoken'),
                },
            }).then((res) => {
                resolve(
                    res.data
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
                            sessionStorage.getItem('EAtoken'),
                    }

                }).then((res) => {
                    resolve(
                        res.data
                    );
                }).catch((err) => {
                    reject(err);
                })))
        }
        // Get Excel sheet of all graphics
    static createExcel(itemId) {
        return new Promise(((resolve, reject) =>
            axios.get(host + '/export/excel/' + itemId, {
                responseType: 'arraybuffer',
                headers: {
                    'Authorization': "Bearer " +
                        sessionStorage.getItem('EAtoken'),
                },

            }).then((res) => {
                resolve(
                    this.forceFileDownload(res)
                );
            }).catch((err) => {
                reject(err);
            })))
    }

    static forceFileDownload(response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'event.xlsx') //or any other extension
        document.body.appendChild(link)
        link.click()
    }
}
export default REST_interface