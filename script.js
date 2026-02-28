document.addEventListener("DOMContentLoaded", () => {

  /* ================= USER ================= */
  const defaultUser = {
    name: "Rishabh Srivastava",
    photo: "profile.jpg",   // put profile.jpg in same folder
    pin: "1234"
  };

  const user = JSON.parse(localStorage.getItem("user")) || defaultUser;
  localStorage.setItem("user", JSON.stringify(user));

  /* ================= LOGIN ================= */
  window.login = function () {
    const enteredPin = document.getElementById("pinInput").value;
    if (enteredPin === user.pin) {
      document.getElementById("loginScreen").classList.add("hidden");
      document.getElementById("app").classList.remove("hidden");
      initApp();
    } else {
      alert("Incorrect PIN");
    }
  };

  function initApp() {
    document.getElementById("userName").innerText = user.name;
    document.getElementById("profilePic").src = user.photo;

    renderDays();
    calculateStreak();
    renderBadges();
    renderHeatmap();
    renderWeeklyChart();
  }

  /* ================= TAB SWITCHING ================= */
  window.showTab = function (tab) {
    document.querySelectorAll(".tab").forEach(btn =>
      btn.classList.remove("active")
    );
    document.querySelectorAll(".tab-content").forEach(sec =>
      sec.classList.remove("active")
    );

    document.querySelector(
      `button[onclick="showTab('${tab}')"]`
    ).classList.add("active");

    document.getElementById(tab).classList.add("active");

    if (tab === "charts") {
      renderWeeklyChart(); // force refresh
    }
  };

  /* ================= TASKS (DETAILED ROADMAP) ================= */
  const tasks = {
    1:["Linux architecture","Filesystem hierarchy","Core commands","Permissions","grep & find","Troubleshooting"],
    2:["Processes","systemctl","Boot process","Disk usage","Memory & CPU","Logs"],
    3:["TCP/IP","DNS flow","Ports","Networking tools","Firewall basics"],
    4:["Git install","Commits","Branches","Merge vs rebase",".gitignore","PR flow"],
    5:["Bash basics","Conditions","Loops","Functions","Cron jobs"],
    6:["AWS account","IAM users","IAM roles","Policies","Regions","Pricing"],
    7:["EC2 launch","Security groups","SSH","AMI","Lifecycle"],

    8:["Containers intro","Dockerfile","Images","Run containers","Ports"],
    9:["Volumes","Networks","Env vars","Docker Compose"],
    10:["CI/CD concepts","Pipeline stages","Artifacts"],
    11:["Install Jenkins","Plugins","Freestyle job"],
    12:["Declarative pipeline","Docker build","Push image","Credentials"],
    13:["AWS deploy","Automation","Logs"],
    14:["CI/CD mini project","Testing","Docs"],

    15:["Why Kubernetes","Pods","Deployments","Services","kubectl"],
    16:["Minikube","Deploy app","Scaling","Rolling updates"],
    17:["ConfigMaps","Secrets","Best practices"],
    18:["EKS architecture","Nodes","IAM roles"],
    19:["Create EKS","kubectl","Deploy app"],
    20:["LoadBalancer","Ingress","ALB"],
    21:["Scaling","Rolling updates","Mini project"],

    22:["IaC concepts","Terraform install","Providers","State"],
    23:["Terraform EC2","VPC","Variables","Apply/destroy"],
    24:["Ansible basics","Inventory","Playbooks"],
    25:["CloudWatch","Metrics","Alarms"],
    26:["Prometheus","Grafana","Dashboards"],
    27:["IAM security","Secrets","TLS"],
    28:["Backups","Snapshots","DR"],
    29:["Final project","Automation","Monitoring"],
    30:["Architecture review","Interview prep","Resume"]
  };

  let progress = JSON.parse(localStorage.getItem("progress")) || {};

  /* ================= RENDER DAYS ================= */
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

      tasks[d].forEach((task, i) => {
        const key = `${d}-${i}`;
        div.innerHTML += `
          <div class="task">
            <input type="checkbox" ${progress[key] ? "checked" : ""}
            onchange="toggle('${key}')"> ${task}
          </div>`;
      });

      daysDiv.appendChild(div);
      updateDayProgress(d);
    }
  }

  /* ================= TOGGLE ================= */
  window.toggle = function (key) {
    progress[key] = !progress[key];
    localStorage.setItem("progress", JSON.stringify(progress));

    const day = parseInt(key.split("-")[0]);
    updateDayProgress(day);

    calculateStreak();
    renderBadges();
    renderHeatmap();
    renderWeeklyChart();
  };

  /* ================= DAY % ================= */
  function updateDayProgress(day) {
    const total = tasks[day].length;
    const done = tasks[day].filter((_, i) =>
      progress[`${day}-${i}`]
    ).length;

    const percent = Math.round((done / total) * 100);
    document.getElementById(`percent-${day}`).innerText = percent + "%";
    document.getElementById(`bar-${day}`).style.width = percent + "%";
  }

  /* ================= STREAK ================= */
  function calculateStreak() {
    const completedDays = new Set();
    Object.keys(progress).forEach(k => {
      if (progress[k]) completedDays.add(+k.split("-")[0]);
    });

    let streak = 0;
    for (let d = 1; d <= 30; d++) {
      if (completedDays.has(d)) streak++;
      else break;
    }
    document.getElementById("streakCount").innerText = streak;
  }

  /* ================= BADGES ================= */
  function completedDaysCount() {
    const s = new Set();
    Object.keys(progress).forEach(k => progress[k] && s.add(k.split("-")[0]));
    return s.size;
  }

  function renderBadges() {
    const div = document.getElementById("badges");
    div.innerHTML = "";

    const badges = [
      ["🚀","Day 1 Ignition",1],
      ["🔥","7-Day Streak",7],
      ["🧱","14-Day Consistency",14],
      ["🏆","DevOps Finisher",30]
    ];

    badges.forEach(b => {
      const el = document.createElement("div");
      el.className = `badge ${completedDaysCount() >= b[2] ? "unlocked" : ""}`;
      el.innerText = `${b[0]} ${b[1]}`;
      div.appendChild(el);
    });
  }

  /* ================= HEATMAP ================= */
  function renderHeatmap() {
    const map = document.getElementById("heatmap");
    map.innerHTML = "";

    for (let d = 1; d <= 30; d++) {
      const done = tasks[d].filter((_, i) =>
        progress[`${d}-${i}`]
      ).length;

      const level = done === 0 ? 0 : done <= 2 ? 1 : done <= 4 ? 2 : 3;
      const cell = document.createElement("div");
      cell.className = `heat-day level-${level}`;
      cell.innerText = d;
      map.appendChild(cell);
    }
  }

  /* ================= WEEKLY CHART ================= */
  let weeklyChart;
  function renderWeeklyChart() {
    const weeks = [0,0,0,0];
    Object.keys(progress).forEach(k => {
      if (progress[k]) {
        const day = +k.split("-")[0];
        weeks[Math.floor((day - 1) / 7)]++;
      }
    });

    if (weeklyChart) weeklyChart.destroy();

    weeklyChart = new Chart(
      document.getElementById("weeklyChart"),
      {
        type: "bar",
        data: {
          labels: ["Week 1","Week 2","Week 3","Week 4"],
          datasets: [{
            data: weeks,
            backgroundColor: "#38bdf8"
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true }
          }
        }
      }
    );
  }

});