document.addEventListener("DOMContentLoaded", () => {

  const user = {
    name: "Rishabh Srivastava",
    photo: "profile.jpg"
  };

  document.getElementById("userName").innerText = user.name;
  document.getElementById("profilePic").src = user.photo;

  window.showTab = function(tab) {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    document.querySelector(`button[onclick="showTab('${tab}')"]`).classList.add("active");
    document.getElementById(tab).classList.add("active");
    if (tab === "charts") renderWeeklyChart();
  };

  const tasks = {
    1:["Linux architecture","Filesystem","Commands","Permissions","grep/find","Troubleshooting"],
    2:["Processes","systemctl","Boot","Disk","Memory","Logs"],
    3:["TCP/IP","DNS","Ports","Network tools","Firewall"],
    4:["Git setup","Commits","Branches","Rebase","PRs"],
    5:["Bash","Conditions","Loops","Functions","Cron"],
    6:["AWS account","IAM","Policies","Regions","Pricing"],
    7:["EC2","Security groups","SSH","AMI"],
    8:["Docker intro","Dockerfile","Images","Containers"],
    9:["Volumes","Networks","Compose"],
    10:["CI/CD concepts","Pipeline stages"],
    11:["Jenkins install","Jobs"],
    12:["Pipeline","Docker build","Push"],
    13:["AWS deploy","Automation"],
    14:["CI/CD project"],
    15:["Kubernetes basics","Pods","Services"],
    16:["Minikube","Scaling"],
    17:["ConfigMaps","Secrets"],
    18:["EKS architecture"],
    19:["EKS deploy"],
    20:["LoadBalancer","Ingress"],
    21:["Scaling","Rolling updates"],
    22:["Terraform basics"],
    23:["Terraform AWS"],
    24:["Ansible basics"],
    25:["CloudWatch"],
    26:["Prometheus","Grafana"],
    27:["IAM security"],
    28:["Backups","DR"],
    29:["Final project"],
    30:["Review","Interview prep"]
  };

  let progress = JSON.parse(localStorage.getItem("progress")) || {};
  const daysDiv = document.getElementById("days");

  function renderDays() {
    daysDiv.innerHTML = "";
    for (let d = 1; d <= 30; d++) {
      const div = document.createElement("div");
      div.className = "day";
      div.innerHTML = `
        <div class="day-header">
          <strong>Day ${d}</strong>
          <span class="percent" id="percent-${d}">0%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" id="bar-${d}"></div>
        </div>
      `;
      tasks[d].forEach((t,i) => {
        const key = `${d}-${i}`;
        div.innerHTML += `
          <div class="task">
            <input type="checkbox" ${progress[key] ? "checked" : ""} 
            onchange="toggle('${key}')"> ${t}
          </div>`;
      });
      daysDiv.appendChild(div);
      updateDayProgress(d);
    }
  }

  window.toggle = function(key) {
    progress[key] = !progress[key];
    localStorage.setItem("progress", JSON.stringify(progress));
    const day = +key.split("-")[0];
    updateDayProgress(day);
    calculateStreak();
    renderBadges();
    renderHeatmap();
    renderWeeklyChart();
  };

  function updateDayProgress(day) {
    const total = tasks[day].length;
    const done = tasks[day].filter((_,i)=>progress[`${day}-${i}`]).length;
    const pct = Math.round((done/total)*100);
    document.getElementById(`percent-${day}`).innerText = pct+"%";
    document.getElementById(`bar-${day}`).style.width = pct+"%";
  }

  function calculateStreak() {
    const s = new Set();
    Object.keys(progress).forEach(k => progress[k] && s.add(+k.split("-")[0]));
    let streak = 0;
    for (let d=1; d<=30; d++) { if (s.has(d)) streak++; else break; }
    document.getElementById("streakCount").innerText = streak;
  }

  function renderBadges() {
    const div = document.getElementById("badges");
    div.innerHTML = "";
    [["🚀","Day 1",1],["🔥","7 Days",7],["🧱","14 Days",14],["🏆","Finisher",30]]
      .forEach(b => {
        const el = document.createElement("div");
        el.className = `badge ${completedDays()>=b[2]?"unlocked":""}`;
        el.innerText = `${b[0]} ${b[1]}`;
        div.appendChild(el);
      });
  }

  function completedDays() {
    const s = new Set();
    Object.keys(progress).forEach(k => progress[k] && s.add(k.split("-")[0]));
    return s.size;
  }

  function renderHeatmap() {
    const map = document.getElementById("heatmap");
    map.innerHTML = "";
    for (let d=1; d<=30; d++) {
      const done = tasks[d].filter((_,i)=>progress[`${d}-${i}`]).length;
      const lvl = done===0?0:done<=2?1:done<=4?2:3;
      const cell = document.createElement("div");
      cell.className = `heat-day level-${lvl}`;
      cell.innerText = d;
      map.appendChild(cell);
    }
  }

  let weeklyChart;
  function renderWeeklyChart() {
    const w=[0,0,0,0];
    Object.keys(progress).forEach(k=>progress[k]&&w[Math.floor((+k.split("-")[0]-1)/7)]++);
    if (weeklyChart) weeklyChart.destroy();
    weeklyChart=new Chart(document.getElementById("weeklyChart"),{
      type:"bar",
      data:{labels:["W1","W2","W3","W4"],datasets:[{data:w}]},
      options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}
    });
  }

  renderDays();
  calculateStreak();
  renderBadges();
  renderHeatmap();
  renderWeeklyChart();

});