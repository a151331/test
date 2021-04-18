let section = document.querySelector("section");

//event.preventDefault() 停止事件的默認動作
let add = document.querySelector("form button");
add.addEventListener("click", e => {
    e.preventDefault();



    //click的動作在form button層,所以要回上一層
    let form = e.target.parentElement;
    //children子層
    let todoText = form.children[0].value;
    let todoYear = form.children[1].value;
    let todoMonth = form.children[2].value;
    let todoDate = form.children[3].value;

    //提示未輸入資料
    if (todoText, todoYear, todoMonth, todoDate === "") {
        alert("請輸入事項");
        return;
    }

    //建立div標籤
    let todo = document.createElement("div");
    todo.classList.add("todo");
    //建立P標籤
    let text = document.createElement("p");
    //在P內建立class
    text.classList.add("todo-text");
    //在P內輸入值
    text.innerText = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoYear + "/" + todoMonth + "/" + todoDate;
    //把text和time二個P移到todo內
    todo.appendChild(text);
    todo.appendChild(time);

    //增加打勾圖示
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    //事項完成時標示記號
    completeButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        // todoItem.classList.add("done");
        //改成toggle可以循環done功能
        todoItem.classList.toggle("done");
    })

    //增加trash圖示
    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    //設定移除動畫與特效
    trashButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        //下方動畫結束再執行remove
        todoItem.addEventListener("animationend", () => {
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item, index) => {
                if (item.todoText == text) {
                    //刪除第index(序號)筆(含)之後1筆(如果有第三個,1 就是新增一筆1
                    myListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArray));
                }
            })
            todoItem.remove();
        })
        todoItem.style.animation = "scaleDown 0.3s forwards";
    })

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);
    //新增事項時彈出動畫scaleUp
    todo.style.animation = "scaleUp 0.3s forwards";

    ////將資料以陣列方式存入localStorage
    //設定物件
    let myTodo = {
        todoText: todoText,
        todoYear: todoYear,
        todoMonth: todoMonth,
        todoDate: todoDate
    };
    //先抓storage有沒有資料,如果沒有,就把輸入的值變成字串存入list,
    let myList = localStorage.getItem("list");
    if (myList == null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));
    } else {
        //如果有資料,就將它變成陣列,再將它送到myTodo,新增一筆(這裡不太懂,暫時這樣寫,可能有誤)
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArray));
    }


    ////按下新增事項按鈕後清空輸入框
    form.children[0].value = "";
    form.children[1].value = "";
    form.children[2].value = "";
    form.children[3].value = "";

    //把todo移到section內
    section.appendChild(todo);
});

///////////////////////////////////////////////////////////////////////////
//這段和上面幾乎一樣,前面四行是判斷,sotrage裡已有值,網頁關掉重開,不用輸入值,會直接帶入
let myList = localStorage.getItem("list");
if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach(item => {

        let todo = document.createElement("div");
        todo.classList.add("todo");
        let text = document.createElement("p");
        text.classList.add("todo-text");
        text.innerText = item.todoText;
        let time = document.createElement("p");
        time.classList.add("todo-time");
        time.innerText = item.todoYear + "/" + item.todoMonth + " / " + item.todoDate;
        todo.appendChild(text);
        todo.appendChild(time);
        let completeButton = document.createElement("button");
        completeButton.classList.add("complete");
        completeButton.innerHTML = '<i class="fas fa-check"x/i>';
        completeButton.addEventListener("click", e => {
            let todoItem = e.target.parentElement;
            todoItem.classList.toggle("done");
        })

        
        let trashButton = document.createElement("button");
        trashButton.classList.add("trash");
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.addEventListener("click", e => {
            let todoItem = e.target.parentElement;
            todoItem.addEventListener("animationend", () => {
                let text = todoItem.children[0].innerText;
                let myListArray = JSON.parse(localStorage.getItem("list"));
                myListArray.forEach((item, index) => {
                    if (item.todoText == text) {
                        myListArray.splice(index, 1);
                        localStorage.setItem("list", JSON.stringify(myListArray));
                    }
                })
                todoItem.remove();
            })
            todoItem.style.animation = "scaleDown 0.3s forwards";
        })
        todo.appendChild(completeButton);
        todo.appendChild(trashButton);
        todo.style.animation = "scaleUp 0.3s forwards";
        section.appendChild(todo);
    })
}

//建立比較函式
function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;
    while (i < arr1.length && j < arr2.length) {
        if (Number(arr1[i].todoYear) > Number(arr2[j].todoYear)) {
            result.push(arr2[j]);
            j++;
        } else if (Number(arr1[i].todoYear) < Number(arr2[j].todoYear)) {
            result.push(arr1[i]);
            i++;
        } else if (Number(arr1[i].todoYear) == Number(arr2[j].todoYear)) {
            if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
                result.push(arr2[j]);
                j++;
            } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
                result.push(arr1[i]);
                i++;
            } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
                if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
                    result.push(arr2[j]);
                    j++;
                } else {
                    result.push(arr1[i]);
                    i++;
                }
            }
        }
    }
    while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while (j < arr2.length) {
        result.push(arr2[j]);
        j++;
    }
    return result;
}
function mergeSort(arr) {
    if (arr.length === 1) {
        return arr;
    } else {
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
}

//建立按鈕功能
let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));
    let len = section.children.length;
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }
    loadData();
    function loadData(){
        let myList = localStorage.getItem("list");
        if (myList !== null) {
            let myListArray = JSON.parse(myList);
            myListArray.forEach(item => {
        
                let todo = document.createElement("div");
                todo.classList.add("todo");
                let text = document.createElement("p");
                text.classList.add("todo-text");
                text.innerText = item.todoText;
                let time = document.createElement("p");
                time.classList.add("todo-time");
                time.innerText = item.todoYear + "/" + item.todoMonth + " / " + item.todoDate;
                todo.appendChild(text);
                todo.appendChild(time);
                let completeButton = document.createElement("button");
                completeButton.classList.add("complete");
                completeButton.innerHTML = '<i class="fas fa-check"x/i>';
                completeButton.addEventListener("click", e => {
                    let todoItem = e.target.parentElement;
                    todoItem.classList.toggle("done");
                })
                let trashButton = document.createElement("button");
                trashButton.classList.add("trash");
                trashButton.innerHTML = '<i class="fas fa-trash"></i>';
                trashButton.addEventListener("click", e => {
                    let todoItem = e.target.parentElement;
                    todoItem.addEventListener("animationend", () => {
                        let text = todoItem.children[0].innerText;
                        let myListArray = JSON.parse(localStorage.getItem("list"));
                        myListArray.forEach((item, index) => {
                            if (item.todoText == text) {
                                myListArray.splice(index, 1);
                                localStorage.setItem("list", JSON.stringify(myListArray));
                            }
                        })
                        todoItem.remove();
                    })
                    todoItem.style.animation = "scaleDown 0.3s forwards";
                })
                todo.appendChild(completeButton);
                todo.appendChild(trashButton);
                todo.style.animation = "scaleUp 0.3s forwards";
                section.appendChild(todo);
            })
        }
    }
})