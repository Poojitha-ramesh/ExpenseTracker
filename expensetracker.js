let expenses = [];

function addExpense() {
    const name = document.getElementById("expenseName").value;
    const amount = parseFloat(document.getElementById("expenseAmount").value);
    const category = document.getElementById("expenseCategory").value;

    if(name && !isNaN(amount) && amount > 0){
        expenses.push({name, amount, category});
        document.getElementById("expenseName").value = '';
        document.getElementById("expenseAmount").value = '';
        show('All');
    } else {
        alert("Enter valid name and amount");
    }
}

function show(category){
    const list = document.getElementById("expenseList");
    list.innerHTML = '';
    let filtered = category === 'All' ? expenses : expenses.filter(e => e.category === category);

    let total = 0;
    filtered.forEach(e => {
        let li = document.createElement('li');
        li.textContent = `${e.name} - ${e.amount} (${e.category})`;
        list.appendChild(li);
        total += e.amount;
    });

    document.getElementById("categoryTitle").textContent = `${category} Expenses`;
    document.getElementById("totalSpent").textContent = `Total Spent: ${total}`;

    drawPieChart();
    showWarning();
}

function drawPieChart(){
    const canvas = document.getElementById('pieChart');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(expenses.length === 0) return;

    const totals = {};
    expenses.forEach(e => totals[e.category] = (totals[e.category] || 0) + e.amount);

    const colors = {Food:'#3b82f6', Travel:'#22c55e', Study:'#fbbf24'};
    let startAngle = 0;
    const totalAll = expenses.reduce((sum,e)=>sum+e.amount,0);

    for(let cat in totals){
        let sliceAngle = (totals[cat]/totalAll)*2*Math.PI;
        ctx.fillStyle = colors[cat];
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, canvas.height/2);
        ctx.arc(canvas.width/2, canvas.height/2, 100, startAngle, startAngle+sliceAngle);
        ctx.closePath();
        ctx.fill();
        startAngle += sliceAngle;
    }
}

function showWarning() {
    if (expenses.length === 0) {
        document.getElementById("warning").textContent = '';
        return;
    }
    const totals = {};
    expenses.forEach(e => totals[e.category] = (totals[e.category] || 0) + e.amount);
    let maxCategory = null;
    let maxAmount = 0;
    for (let cat in totals) {
        if (totals[cat] > maxAmount) {
            maxAmount = totals[cat];
            maxCategory = cat;
        }
    }
    if (maxCategory) {
        document.getElementById("warning").textContent = `Warning: You spent the most on ${maxCategory} (${maxAmount})!`;
    } else {
        document.getElementById("warning").textContent = '';
    }
}
window.onload = function() {
    showCategory('All');
};