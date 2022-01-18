// function getReviewData(fid, roles) {

//     reviews.filter(r => {
//         return (r.franchiseeId === fid || fid === 0) && roles.indexOf(r.roleId) >= 0;
//     })


// }



// reviews = getReviewData(user.franchiseeId, user.roles);


interface RoleMap {
    fid: number;
    rid: number;
    roles: number[];
}

interface Review {
    fid: number;
    rid: number;
    nums: number;
    key: string;
}

interface SendData {
    [roomKey: string]: Review[]
}

// const reviews: Review[] = [];
const roles: RoleMap[] = [];

function getSendData(reviews: Review[]) {

    const res: SendData = {};

    reviews.forEach(review => {
        roles.filter(role => {
            return (role.fid === 0 || role.fid === review.fid) && role.roles.indexOf(review.rid) >= 0;
        }).forEach(role => {
            const key = `${role.fid}-${role.rid}`;
            if (key in res) {
                res[key] = [];
            }
            res[key].push(review);
        });
    });

    return res;

    Object.keys(res).forEach(roomKey => {
        const reviewDatas = res[roomKey];
        // io.to(roomKey).emit('xxx', reviewDatas);
    })

}


let cacheReviews: Review[] = [
    { fid: 2, rid: 3, key: 'a', nums: 2 },
    { fid: 3, rid: 3, key: 'a', nums: 2 },
    { fid: 3, rid: 4, key: 'b', nums: 2 },
    { fid: 3, rid: 3, key: 'c', nums: 2 },
    { fid: 3, rid: 3, key: 'd', nums: 2 },
];

let reloadFid = 0;
let reloadRid = 0;
let reloadType: { types?: string[] } = { types: [] };

let delReviews: Review[] = [];

let newReviews: Review[] = [
    { fid: 2, rid: 3, key: 'a', nums: 2 },
    { fid: 3, rid: 3, key: 'a', nums: 2 },
    { fid: 3, rid: 4, key: 'b', nums: 2 },
    { fid: 3, rid: 3, key: 'c', nums: 2 },
    // {fid: 3, rid: 3, key: 'b', nums: 2},
    // {fid: 3, rid: 3, key: 'c', nums: 2},
];
const dataTypes = reloadType.types && reloadType.types.length != 0 ? reloadType.types : null;

cacheReviews = cacheReviews.filter(cr => {
    if (
        (reloadFid === 0 || cr.fid === reloadFid) &&
        (reloadRid === 0 || cr.rid === reloadRid) &&
        (dataTypes === null || dataTypes.some(t => t == cr.key))
    ) {
        delReviews.push(cr);
        return false;
    }
    return true;
});

const newRids = newReviews.map(r => `${r.fid}-${r.rid}-${r.key}`);
cacheReviews = cacheReviews.concat(newReviews);
// console.info(newRids);

delReviews = delReviews.filter(dr => {
    const key = `${dr.fid}-${dr.rid}-${dr.key}`
    return newRids.indexOf(key) < 0;
})
// console.log(delReviews);
delReviews.forEach(dr => {
    newReviews.push({
        ...dr,
        nums: 0,
    });
});

const map = new Map();
cacheReviews.forEach(item => {
    const v = map.get(`${item.fid}-${item.rid}`) || []
    v.push(item);
    map.set(`${item.fid}-${item.rid}` , v);
});
map.forEach((v,key) => {
    console.log(key);
    console.log(v , 'val');
});
// console.info(newReviews, '修');
// console.log(cacheReviews, '原');