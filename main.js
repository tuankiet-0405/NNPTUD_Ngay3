async function getData() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();
        let body = document.getElementById('table_body');
        body.innerHTML = '';
        for (const post of posts) {
            // Hiển thị bài xoá mềm với gạch ngang
            const titleDisplay = post.isDeleted ? `<s>${post.title}</s>` : post.title;
            const isDeletedStyle = post.isDeleted ? "style='opacity: 0.5; background-color: #f0f0f0;'" : "";
            
            body.innerHTML += `<tr ${isDeletedStyle}>
                <td>${post.id}</td>
                <td>${titleDisplay}</td>
                <td>${post.views}</td>
                <td><input type='submit' value='Delete' onclick='Delete(${post.id})'></td>
            </tr>`
        }
    } catch (error) {
        console.log(error);
    }
}

async function getMaxId() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();
        if (posts.length === 0) return 0;
        
        // Tìm ID lớn nhất từ các post chưa xoá
        let maxId = 0;
        for (const post of posts) {
            if (!post.isDeleted) {
                let id = parseInt(post.id);
                if (id > maxId) {
                    maxId = id;
                }
            }
        }
        return maxId;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

async function Save() {
    let id = document.getElementById('txt_id').value;
    let title = document.getElementById('txt_title').value;
    let views = document.getElementById('txt_views').value;
    
    // Nếu không nhập ID, tự động tăng ID
    if (!id || id.trim() === '') {
        let maxId = await getMaxId();
        id = (maxId + 1).toString();
    }
    
    let getItem = await fetch('http://localhost:3000/posts/' + id);
    if (getItem.ok) {
        //edit
        let res = await fetch('http://localhost:3000/posts/'+id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                views: views,
                isDeleted: false  // Khi sửa, đánh dấu là không xoá
            })
        })
        if (res.ok) {
            console.log("thanh cong");
            document.getElementById('txt_id').value = '';
            document.getElementById('txt_title').value = '';
            document.getElementById('txt_views').value = '';
            getData();
        }
    } else {
        //create
        let res = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                title: title,
                views: views,
                isDeleted: false
            })
        })
        if (res.ok) {
            console.log("thanh cong");
            document.getElementById('txt_id').value = '';
            document.getElementById('txt_title').value = '';
            document.getElementById('txt_views').value = '';
            getData();
        }
    }
}

async function Delete(id) {
    // Xoá mềm: cập nhật isDeleted thành true thay vì xoá hoàn toàn
    let res = await fetch('http://localhost:3000/posts/' + id, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: true
        })
    })
    if (res.ok) {
        console.log("xoa thanh cong");
        getData();
    }
}

getData();
