// // =========================
// // CẤU HÌNH FACEBOOK
// // =========================
// const PAGE_ACCESS_TOKEN = "EAALunQEriZBABQI0YLxMag9vg3W9oV51CRliQehGJZAuJnbDimVisc20kqGIamRSZCzzGtJVCDy2OqjekhHdg9qECWZC3QnJRzIIyx4rFZBqBlPplttmkZBllqzthqJpxychN5dQEdA9QL3FEIQeXr65NeRMmyGpEN5OEpfmJrdi3W0u7Qd0FPB7TKnyPubTzRspIZCLZBnDPyAd2Kw7xEZCjFNbk";
// const PAGE_ID = "488694371005256";

// // DOM
// const reactionCount = document.getElementById("reactionCount");
// const commentCount = document.getElementById("commentCount");
// const shareCount = document.getElementById("shareCount");
// const postList = document.getElementById("postList");

// // =========================
// // LOAD POSTS
// // =========================
// async function loadPosts() {
//     const res = await fetch(
//         `https://graph.facebook.com/${PAGE_ID}/posts?fields=id,message,shares.summary(true),likes.summary(true),comments.summary(true)&access_token=${PAGE_ACCESS_TOKEN}`
//     );

//     const data = await res.json();

//     console.log("Dữ liệu Facebook:", data);

//     if (!data.data) return;

//     postList.innerHTML = "";

//     let totalReactions = 0;
//     let totalComments = 0;
//     let totalShares = 0;

//     data.data.forEach(post => {
//         const reactions = post.likes?.summary?.total_count || 0;
//         const comments = post.comments?.summary?.total_count || 0;
//         const shares = post.shares?.count || 0;

//         totalReactions += reactions;
//         totalComments += comments;
//         totalShares += shares;

//         // Bổ sung vào bảng
//         postList.innerHTML += `
//             <tr>
//                 <td>${post.id}</td>
//                 <td>${post.message ? post.message.substring(0, 100) : "(Không có nội dung)"}</td>
//                 <td>${reactions}</td>
//                 <td>${comments}</td>
//                 <td>${shares}</td>
//             </tr>
//         `;
//     });

//     // Tổng hiển thị lên trên
//     reactionCount.textContent = totalReactions;
//     commentCount.textContent = totalComments;
//     shareCount.textContent = totalShares;
// }

// loadPosts();





// const PAGE_ACCESS_TOKEN = "EAALunQEriZBABQI0YLxMag9vg3W9oV51CRliQehGJZAuJnbDimVisc20kqGIamRSZCzzGtJVCDy2OqjekhHdg9qECWZC3QnJRzIIyx4rFZBqBlPplttmkZBllqzthqJpxychN5dQEdA9QL3FEIQeXr65NeRMmyGpEN5OEpfmJrdi3W0u7Qd0FPB7TKnyPubTzRspIZCLZBnDPyAd2Kw7xEZCjFNbk";
// const PAGE_ID = "488694371005256";

// // DOM
// const reactionCount = document.getElementById("reactionCount");
// const commentCount = document.getElementById("commentCount");
// const shareCount = document.getElementById("shareCount");
// const postList = document.getElementById("postList");

// // =========================
// // GET REACTIONS OF A POST
// // =========================
// async function getReactions(postId) {
//     const types = ["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY", "CARE"];
//     let total = 0;

//     for (let type of types) {
//         const res = await fetch(
//             `https://graph.facebook.com/${postId}/reactions?type=${type}&summary=1&access_token=${PAGE_ACCESS_TOKEN}`
//         );
//         const data = await res.json();
//         total += data.summary?.total_count || 0;
//     }

//     return total;
// }

// // =========================
// // LOAD POSTS
// // =========================
// async function loadPosts() {
//     const res = await fetch(
//         `https://graph.facebook.com/${PAGE_ID}/posts?fields=id,message,shares,comments.summary(true)&access_token=${PAGE_ACCESS_TOKEN}`
//     );

//     const data = await res.json();
//     console.log("Dữ liệu Facebook:", data);

//     if (!data.data) return;

//     postList.innerHTML = "";

//     let totalReactions = 0;
//     let totalComments = 0;
//     let totalShares = 0;

//     // Lặp qua từng bài
//     for (let post of data.data) {
//         const comments = post.comments?.summary?.total_count || 0;
//         const shares = post.shares?.count || 0;

//         // Lấy reaction đúng cách
//         const reactions = await getReactions(post.id);

//         totalReactions += reactions;
//         totalComments += comments;
//         totalShares += shares;

//         postList.innerHTML += `
//             <tr>
//                 <td>${post.id}</td>
//                 <td>${post.message ? post.message.substring(0, 80) : "(Không có nội dung)"}</td>
//                 <td>${reactions}</td>
//                 <td>${comments}</td>
//                 <td>${shares}</td>
//             </tr>
//         `;
//     }

//     // Update tổng phía trên
//     reactionCount.textContent = totalReactions;
//     commentCount.textContent = totalComments;
//     shareCount.textContent = totalShares;
// }

// loadPosts();












const PAGE_ACCESS_TOKEN = "EAALunQEriZBABQI0YLxMag9vg3W9oV51CRliQehGJZAuJnbDimVisc20kqGIamRSZCzzGtJVCDy2OqjekhHdg9qECWZC3QnJRzIIyx4rFZBqBlPplttmkZBllqzthqJpxychN5dQEdA9QL3FEIQeXr65NeRMmyGpEN5OEpfmJrdi3W0u7Qd0FPB7TKnyPubTzRspIZCLZBnDPyAd2Kw7xEZCjFNbk";
const PAGE_ID = "488694371005256";

const reactionCount = document.getElementById("reactionCount");
const commentCount = document.getElementById("commentCount");
const shareCount = document.getElementById("shareCount");
const postList = document.getElementById("postList");

async function loadPosts() {
    const res = await fetch(
        `https://graph.facebook.com/${PAGE_ID}/posts
        ?fields=id,message,shares,comments.summary(true),reactions.summary(true)
        &access_token=${PAGE_ACCESS_TOKEN}`
        .replace(/\s+/g, "")
    );

    const data = await res.json();
    console.log("Dữ liệu Facebook:", data);

    if (!data.data) return;

    postList.innerHTML = "";

    let totalReactions = 0;
    let totalComments = 0;
    let totalShares = 0;

    for (let post of data.data) {
        const reactions = post.reactions?.summary?.total_count || 0;
        const comments = post.comments?.summary?.total_count || 0;
        const shares = post.shares?.count || 0;

        totalReactions += reactions;
        totalComments += comments;
        totalShares += shares;

        postList.innerHTML += `
            <tr>
                <td>${post.id}</td>
                <td>${post.message ? post.message.substring(0, 80) : "(Không có nội dung)"}</td>
                <td>${reactions}</td>
                <td>${comments}</td>
                <td>${shares}</td>
            </tr>
        `;
    }

    reactionCount.textContent = totalReactions;
    commentCount.textContent = totalComments;
    shareCount.textContent = totalShares;
}


loadPosts();
