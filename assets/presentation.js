/* 流式细胞仪课程演示：翻页、时间轴、三大系统与仪器教学模拟器 */
(function () {
  "use strict";

  const SLIDE_TITLES = [
    "封面", "汇报路径", "发展简史", "核心用途", "三大系统",
    "检测原理", "规范操作", "安全要点", "小结", "参考文献", "致谢"
  ];

  const HISTORY = [
    {
      year: "1948–1953",
      pos: 0,
      tag: "库尔特计数原理",
      who: "Wallace H. Coulter",
      body: "1948 年 10 月，Coulter 用稀释过的血做了演示：一个血细胞穿过通电的小孔时，电阻会短暂变一下，靠这个就能数细胞，还能看出细胞体积。专利 1949 年 8 月 27 日申请，1953 年 10 月 20 日授权（US 2,656,508）。1950 年代中期，用这个原理的自动血细胞计数仪开始上市（Coulter Counter）。很多人把这种电阻法看作流式细胞术的前身之一。",
      src: "依据：美国专利 US 2,656,508；Graham, Cytometry A, 2022；关于 1948 年演示的考证（PMC4237176）。Coulter Counter 具体型号哪年首次公开，不同回顾说法略有差别（都在 1950 年代中期），所以这里不写死。"
    },
    {
      year: "1953",
      pos: 1,
      tag: "鞘流与流体聚焦",
      who: "P. J. Crosland-Taylor",
      body: "Crosland-Taylor 在 Nature 上报道了一种光学计数装置：让鞘液包着样品一起流（同轴层流），把样品柱带快、挤细，细胞就在较宽的管子正中间排成一条细线——就像让细胞排队过安检。这样方便观察，也不容易堵管、不容易把并排过去的两个细胞数成一个。今天大多数流式细胞仪还在用这个“流体聚焦”的办法（也有微毛细管、声波聚焦等别的方案）。",
      src: "Crosland-Taylor, Nature, 1953;171:37–38。层流的流体力学背景可以追到 Reynolds 1883 年的工作，综述见 Picot 等, Cytotechnology, 2012。"
    },
    {
      year: "1965",
      pos: 2,
      tag: "光学快速测量 + 按体积分选",
      who: "Kamentsky 等；Mack J. Fulwyler",
      body: "Kamentsky、Melamed 和 Derman 报道了一台能对单个细胞做超快速分光测量的仪器。同一年，Fulwyler 在洛斯阿拉莫斯把库尔特的体积测量，和喷墨打印那种“液滴带电、再偏转”的办法结合起来，按体积把细胞电子分选出来。从这以后，光学分析和静电分选两条路慢慢合到了一起。",
      src: "Kamentsky et al., Science, 1965;150:630–631；Fulwyler, Science, 1965;150:910–911。"
    },
    {
      year: "1969–1972",
      pos: 3,
      tag: "荧光检测，FACS 出现",
      who: "Dittrich & Göhde；Hulett、Bonner、Herzenberg 等",
      body: "1969 年，Dittrich 和 Göhde 报道了对悬浮单细胞的脉冲荧光测量，后来发展成脉冲细胞光度计（商用设备常叫 ICP）。同一年，Hulett、Bonner、Herzenberg 等报道了按细胞内荧光自动分选哺乳动物细胞。1972 年，Bonner 等在 Review of Scientific Instruments 上完整介绍了用激光激发、静电液滴分选的荧光激活细胞分选（FACS）装置。",
      src: "Dittrich & Göhde, Z Naturforsch B, 1969;24:360–361；Hulett et al., Science, 1969;166:747–749；Bonner et al., Rev Sci Instrum, 1972;43:404–409。"
    },
    {
      year: "1970年代早期",
      pos: 4,
      tag: "分选仪上市",
      who: "斯坦福实验室的技术做成了商品",
      body: "有了实验室原型之后，Becton Dickinson 把荧光激活细胞分选做成了商品，FACS 后来成了通用叫法，也是注册商标。第一台商品机哪年上市，厂家回顾和一些综述里有 1973 和 1974 两种说法，这里不选边，只说是在 1970 年代早期。",
      src: "Herzenberg 等对 FACS 命名和早期工作的回顾（Immunol Today, 2000）；上市年份文献里有 1973/1974 的出入，所以写成一个时间段。"
    },
    {
      year: "1978",
      pos: 5,
      tag: "有了“流式细胞术”这个名字",
      who: "Pensacola 会议",
      body: "1978 年，在佛罗里达 Pensacola 开的 American Engineering Foundation 会议上，这项技术改叫 flow cytometry（流式细胞术），慢慢取代了以前 pulse cytophotometry（脉冲细胞光度术）之类的叫法。",
      src: "Picot 等, Cytotechnology, 2012（PMC3279584）里讲了这次改名。"
    },
    {
      year: "现在",
      pos: 6,
      tag: "多参数单细胞分析",
      who: "分析仪和分选仪一起发展",
      body: "现在的仪器有多个激光、多个荧光通道，每个细胞能同时测散射和好几种标记，用在免疫分型、细胞周期和死亡分析，也用在细胞制品和药物效应研究上。分析和分选的检测原理一样，但分选的气溶胶风险更高，安全要求也更严。这页只讲主线，细节看参考文献。",
      src: "原理综述：Shapiro, Practical Flow Cytometry, 4th ed., 2003；Picot 等, 2012。安全标准：Holmes 等, Cytometry A, 2014。"
    }
  ];

  const SYS_COPY = {
    fluid: {
      title: "流体系统",
      html: "鞘液和样品在流动室里一起流，鞘液在外、样品在中间（同轴层流）。鞘液流得快，把慢一点的样品流拉细、拉直，细胞就差不多一个接一个地经过激光检测点，像排队过安检。样品流相对鞘液开大了，中间这股（芯流）就变粗，细胞容易跑偏，测量误差变大。测完的液体流进废液桶。<ul><li>主要部件：鞘液桶、样品管、流动室或喷嘴、废液桶</li><li>要记住：两者的流速比决定聚焦好不好</li><li>下一页的模拟器可以亲眼看到这一点</li></ul>"
    },
    optics: {
      title: "光学系统",
      html: "一个或几个激光照在检测点的细胞上。往前、小角度散出来的光叫前向散射（FSC），主要跟细胞的相对大小有关；从侧面大约 90° 散出来的叫侧向散射（SSC），更多反映细胞里面复不复杂、颗粒多不多。荧光是标记分子被激发后发的光，经二向色镜和滤光片分开颜色，再由光电倍增管（PMT）或雪崩二极管等探测器接收。<ul><li>FSC：一般用光电二极管</li><li>SSC 和荧光：一般用 PMT（把很弱的光变成电信号并放大）或类似的高灵敏探测器</li><li>激光关了或光路被挡住，就拿不到有效信号</li></ul>"
    },
    electro: {
      title: "电子 / 分析系统",
      html: "探测器把光信号变成电脉冲。系统把脉冲放大，（现代仪器里）再转成数字，超过阈值的才记成一个“事件”，最后画成散点图、直方图。多色实验还要做补偿或光谱拆分、设门（在图上圈出要看的细胞群）和统计。<ul><li>阈值能把太小的碎屑挡在外面</li><li>增益开太高，信号会饱和、峰挤到边上</li><li>图好不好，首先看前面的流体和光学稳不稳</li></ul>"
    }
  };

  const SOP = [
    {
      title: "开机预热",
      html: "<p>先看液体，再开电源。</p><ul><li>确认鞘液够这次实验用，管路接牢。</li><li>确认废液桶接好、没满，并按本实验室 SOP 先加入适量消毒剂。</li><li>打开仪器和工作站，需要的话按说明书灌注或排气。</li><li>预热，让激光和流体系统稳定下来。不同机型一般 15–30 分钟左右，以随机说明书为准；没稳定就别做正式质控。</li></ul><p class='caveat'>顺序参考了 Houston Methodist、UNC 等核心实验室公开 SOP 里的共同做法，具体分钟数不能套到所有型号上。</p>"
    },
    {
      title: "质控",
      html: "<p>先用校准微球做日常质控，确认仪器状态没问题，再跑实验样品。</p><ul><li>按平台规定上指定批次的质控微球。</li><li>看散射点是不是聚成紧紧的一团、荧光峰是不是在该在的位置、变异系数（CV）能不能接受。</li><li>质控没过，先按规程清洗流动室、查有没有气泡或堵塞；必要时停用，并告诉平台管理人员。</li></ul><p class='caveat'>上一页模拟器里的“校准微球”，就是让大家看看“一团紧密的点 + 很窄的荧光峰”长什么样（只是定性示意）。</p>"
    },
    {
      title: "上样",
      html: "<p>样品准备得好不好，往往比事后调电压更重要。</p><ul><li>做成单细胞悬液，需要时先过滤，免得细胞抱团堵管，或两个细胞被当成一个事件。</li><li>控制细胞浓度，先用较低的样品流，需要再往上调。</li><li>上样前再确认一遍样本的生物安全情况（固定了没有、是不是人源或感染性材料），以及批准在哪里操作。</li><li>如果压力不对、事件率突然变了或点图突然乱了，先停下来查是不是堵了。</li></ul>"
    },
    {
      title: "清洗",
      html: "<p>流动室和管路洗没洗干净，决定了下一个人能不能得到干净的背景。</p><ul><li>两个样品之间用鞘液或推荐的冲洗液冲，冲到事件率回到本底。</li><li>用过某些核酸染料（如碘化丙啶、吖啶橙）或高浓度微球之后，常常要多洗一会儿。</li><li>怀疑堵了，按仪器规程清洗流动室，别自己拆高压或激光部件。</li></ul>"
    },
    {
      title: "关机",
      html: "<p>做完实验，不是直接断电就完事。</p><ul><li>按 SOP 跑关机清洗程序。很多分析型仪器最后会依次走含消毒剂的液体和去离子水（一般是几分钟的冲洗，以说明书为准）。</li><li>停流体；规程要求的话，把样品针泡在合适的保护液里。</li><li>处理废液，检查并按规定补鞘液，关软件、仪器和电脑。</li><li>填使用记录，有异常写清楚。</li></ul><p class='caveat'>公开例子：Houston Methodist 给 Fortessa/LSRII 写的“漂白水—纯水”关机流程。请以你所用平台的现行文件为准。</p>"
    }
  ];

  /* ---------- 舞台缩放与翻页 ---------- */
  const stage = document.getElementById("stage");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const progressBar = document.querySelector("#progress span");
  const pageInd = document.getElementById("page-ind");
  const dotsWrap = document.getElementById("dots");
  const hintBar = document.getElementById("hintbar");
  const hintText = document.getElementById("hint-text");
  const overview = document.getElementById("overview");
  const help = document.getElementById("help");
  let index = 0;
  let hintsOn = false;
  let lastIndex = 0;

  function fit() {
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = "translate(-50%, -50%) scale(" + s + ")";
  }
  window.addEventListener("resize", fit);
  fit();

  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = "dot";
    b.type = "button";
    b.title = (i + 1) + "　" + SLIDE_TITLES[i];
    b.setAttribute("aria-label", "第 " + (i + 1) + " 页：" + SLIDE_TITLES[i]);
    b.addEventListener("click", () => go(i));
    dotsWrap.appendChild(b);
  });

  const ovGrid = document.getElementById("ov-grid");
  SLIDE_TITLES.forEach((t, i) => {
    const b = document.createElement("button");
    b.className = "ov-item";
    b.type = "button";
    b.innerHTML = "<div class='n'>" + String(i + 1).padStart(2, "0") + " / 11</div><h3>" + t + "</h3>";
    b.addEventListener("click", () => { overview.classList.remove("on"); go(i); });
    ovGrid.appendChild(b);
  });

  function go(n, ev) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    if (n === index && ev !== "init") return;
    const prev = index;
    index = n;
    slides.forEach((sl, i) => {
      sl.classList.remove("active", "leaving", "exit-left");
      if (i === prev && ev !== "init") {
        sl.classList.add("leaving");
        if (n > prev) sl.classList.add("exit-left");
        setTimeout(() => sl.classList.remove("leaving", "exit-left"), 480);
      }
      if (i === n) sl.classList.add("active");
    });
    dotsWrap.querySelectorAll(".dot").forEach((d, i) => d.setAttribute("aria-current", i === n ? "true" : "false"));
    ovGrid.querySelectorAll(".ov-item").forEach((d, i) => d.setAttribute("aria-current", i === n ? "true" : "false"));
    progressBar.style.width = ((n) / (slides.length - 1)) * 100 + "%";
    pageInd.textContent = String(n + 1).padStart(2, "0");
    hintText.textContent = slides[n].dataset.hint || "";
    if (location.hash !== "#/" + (n + 1)) {
      history.replaceState(null, "", "#/" + (n + 1));
    }
    if (n === 5) sim.resize();
    lastIndex = n;
  }

  function parseHash() {
    const m = location.hash.match(/#\/(\d+)/);
    return m ? Math.max(0, Math.min(10, parseInt(m[1], 10) - 1)) : 0;
  }

  document.querySelectorAll("[data-go]").forEach((el) => {
    el.addEventListener("click", () => go(parseInt(el.dataset.go, 10) - 1));
  });

  document.querySelectorAll(".use-card").forEach((card) => {
    card.addEventListener("click", () => {
      const open = card.classList.contains("open");
      document.querySelectorAll(".use-card").forEach((c) => c.classList.remove("open"));
      if (!open) card.classList.add("open");
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    const k = e.key;
    if (help.classList.contains("on") && k !== "?" && k !== "Escape") {
      if (k === "Escape") help.classList.remove("on");
      return;
    }
    if (k === "ArrowRight" || k === " " || k === "PageDown") { e.preventDefault(); go(index + 1); }
    else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); go(index - 1); }
    else if (k === "Home") { e.preventDefault(); go(0); }
    else if (k === "End") { e.preventDefault(); go(slides.length - 1); }
    else if (k === "f" || k === "F") {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
      else document.exitFullscreen().catch(() => {});
    } else if (k === "h" || k === "H") {
      hintsOn = !hintsOn;
      hintBar.classList.toggle("on", hintsOn);
    } else if (k === "Escape") {
      if (help.classList.contains("on")) help.classList.remove("on");
      else overview.classList.toggle("on");
    } else if (k === "?" || (k === "/" && e.shiftKey)) {
      help.classList.toggle("on");
    } else if (k >= "1" && k <= "9") {
      go(parseInt(k, 10) - 1);
    } else if (k === "0") go(9);
    else if (k === "-") go(10);
  });

  function isScrollableTarget(el) {
    while (el && el !== document.body) {
      const st = window.getComputedStyle(el);
      if ((st.overflowY === "auto" || st.overflowY === "scroll") && el.scrollHeight > el.clientHeight + 4) return true;
      el = el.parentElement;
    }
    return false;
  }
  let wheelLock = 0;
  window.addEventListener("wheel", (e) => {
    if (overview.classList.contains("on") || help.classList.contains("on")) return;
    if (isScrollableTarget(e.target)) return;
    if (index === 5) return; // 模拟器页避免误翻
    if (Date.now() < wheelLock) return;
    if (Math.abs(e.deltaY) < 40) return;
    wheelLock = Date.now() + 700;
    go(index + (e.deltaY > 0 ? 1 : -1));
  }, { passive: true });

  let touchX = null;
  stage.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 60) go(index + (dx < 0 ? 1 : -1));
  }, { passive: true });

  window.addEventListener("hashchange", () => go(parseHash()));

  /* ---------- 封面粒子 ---------- */
  const coverCells = document.getElementById("cover-cells");
  const coverPool = [];
  for (let i = 0; i < 18; i++) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("r", String(4 + Math.random() * 5));
    c.setAttribute("fill", Math.random() > 0.35 ? "#E69F00" : "#F4F1EA");
    coverCells.appendChild(c);
    coverPool.push({ el: c, x: Math.random() * 900, y: 540 + (Math.random() - 0.5) * 10, v: 0.8 + Math.random() * 1.4, flash: 0 });
  }
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function tickCover(t) {
    if (reduceMotion) return;
    coverPool.forEach((p) => {
      p.x += p.v;
      if (p.x > 860) p.x = 40;
      const near = Math.abs(p.x - 520);
      if (near < 8) p.flash = 1;
      p.flash *= 0.9;
      p.el.setAttribute("cx", p.x.toFixed(1));
      p.el.setAttribute("cy", p.y.toFixed(1));
      p.el.setAttribute("opacity", String(0.55 + p.flash * 0.45));
    });
    requestAnimationFrame(tickCover);
  }
  requestAnimationFrame(tickCover);

  /* ---------- 时间轴 ---------- */
  const tlTicks = document.getElementById("tl-ticks");
  const tlFill = document.getElementById("tl-fill");
  const tlKnob = document.getElementById("tl-knob");
  const tlTrack = document.getElementById("tl-track");
  let tlIndex = 0;

  HISTORY.forEach((h, i) => {
    const b = document.createElement("button");
    b.className = "tl-tick";
    b.type = "button";
    b.style.left = (i / (HISTORY.length - 1) * 100) + "%";
    b.textContent = h.year;
    b.addEventListener("click", () => setTimeline(i));
    tlTicks.appendChild(b);
  });

  function setTimeline(i) {
    tlIndex = i;
    const h = HISTORY[i];
    const pct = (i / (HISTORY.length - 1)) * 100;
    tlFill.style.width = pct + "%";
    tlKnob.style.left = pct + "%";
    tlKnob.setAttribute("aria-valuenow", String(i));
    document.getElementById("tl-year").textContent = h.year;
    document.getElementById("tl-tag").textContent = h.tag;
    document.getElementById("tl-who").textContent = h.who;
    document.getElementById("tl-body").textContent = h.body;
    document.getElementById("tl-src").textContent = h.src;
    tlTicks.querySelectorAll(".tl-tick").forEach((t, j) => t.classList.toggle("on", j === i));
  }
  setTimeline(0);

  function tlFromX(clientX) {
    const r = tlTrack.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setTimeline(Math.round(t * (HISTORY.length - 1)));
  }
  let dragging = false;
  tlTrack.addEventListener("pointerdown", (e) => {
    dragging = true;
    tlTrack.setPointerCapture(e.pointerId);
    tlFromX(e.clientX);
  });
  tlTrack.addEventListener("pointermove", (e) => { if (dragging) tlFromX(e.clientX); });
  tlTrack.addEventListener("pointerup", () => { dragging = false; });
  tlKnob.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); e.stopPropagation(); setTimeline(Math.min(6, tlIndex + 1)); }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); e.stopPropagation(); setTimeline(Math.max(0, tlIndex - 1)); }
  });

  /* ---------- 三大系统 ---------- */
  function setSys(id) {
    document.getElementById("sys-title").textContent = SYS_COPY[id].title;
    document.getElementById("sys-body").innerHTML = SYS_COPY[id].html;
    document.querySelectorAll(".sys-tab").forEach((t) => t.setAttribute("aria-selected", t.dataset.sys === id ? "true" : "false"));
    const stageEl = document.getElementById("sys-stage");
    stageEl.classList.add("dim");
    stageEl.querySelectorAll(".sys-hot").forEach((g) => g.classList.toggle("is-on", g.dataset.sys === id));
  }
  document.querySelectorAll(".sys-tab").forEach((t) => t.addEventListener("click", () => setSys(t.dataset.sys)));
  document.querySelectorAll("#sys-stage .sys-hot").forEach((g) => {
    const act = () => setSys(g.dataset.sys);
    g.addEventListener("mouseenter", act);
    g.addEventListener("focus", act);
    g.addEventListener("click", act);
  });
  setSys("fluid");

  /* ---------- SOP ---------- */
  const sopBody = document.getElementById("sop-body");
  function setSop(i) {
    sopBody.innerHTML = "<h3>" + SOP[i].title + "</h3>" + SOP[i].html;
    document.querySelectorAll(".sop-nav button").forEach((b, j) => b.setAttribute("aria-selected", j === i ? "true" : "false"));
  }
  document.querySelectorAll(".sop-nav button").forEach((b) => b.addEventListener("click", () => setSop(parseInt(b.dataset.sop, 10))));
  setSop(0);

  /* ---------- 仪器模拟器 ---------- */
  const sim = {
    sheath: 75,
    sample: 25,
    gain: 70,
    thr: 8,
    type: "beads",
    laserOn: true,
    apertureClosed: true,
    wasteReady: true,
    acquiring: false,
    events: [],
    flEvents: [],
    hist: new Uint16Array(80),
    cells: [],
    evCount: 0,
    evWindow: [],
    coachMode: "intro",
    demoTimer: 0
  };

  const $sheath = document.getElementById("sheath");
  const $sample = document.getElementById("sample");
  const $gain = document.getElementById("gain");
  const $thr = document.getElementById("thr");
  const $coach = document.getElementById("sim-coach");
  const $core = document.getElementById("sim-core");
  const $cells = document.getElementById("sim-cells");
  const $beam = document.getElementById("laser-beam");
  const $laserG = document.getElementById("sim-laser");
  const $apTag = document.getElementById("sim-aperture-tag");
  const cvsSS = document.getElementById("plot-ss");
  const cvsFL = document.getElementById("plot-fl");
  const ctxSS = cvsSS.getContext("2d");
  const ctxFL = cvsFL.getContext("2d");

  function focusModel() {
    const ratio = sim.sample / Math.max(sim.sheath, 5);
    // 教学模型：样品/鞘液比升高 → 芯流变粗、位置抖动增大（参见 Picot 2012 的定性描述）
    const width = 6 + ratio * 42;
    const jitter = Math.min(1, Math.max(0, (ratio - 0.28) / 0.9));
    const quality = jitter < 0.22 ? "好" : jitter < 0.55 ? "一般" : "差（芯流太粗）";
    return { ratio, width, jitter, quality, collapsed: jitter > 0.62 };
  }

  function interlockOk() {
    return sim.apertureClosed && sim.wasteReady;
  }

  function setCoach(text, mode) {
    $coach.textContent = text;
    $coach.className = "sim-coach" + (mode === "alert" ? " alert" : mode === "ok" ? " ok" : "");
    sim.coachMode = mode || "";
  }

  function updateCoachAuto() {
    if (sim.demoTimer) return;
    if (!sim.apertureClosed) {
      setCoach("安全联锁：光阑没关好，不让采集。真实仪器也一样，防护罩打开或联锁被解除时不应该继续工作。", "alert");
      return;
    }
    if (!sim.wasteReady) {
      setCoach("安全联锁：废液桶没接好，不让采集。开机前要确认废液桶接好、没满，并按 SOP 加好消毒剂。", "alert");
      return;
    }
    if (!sim.laserOn) {
      setCoach("激光关着，光照不到检测点，测不到有效的散射和荧光信号。先打开激光再采集。", "alert");
      return;
    }
    const f = focusModel();
    if (f.collapsed) {
      setCoach("样品流相对鞘液开太大了，聚焦变差，细胞没法稳稳地一个个排队通过检测点。点图会散开，测量误差变大。把鞘液调高，或把样品流调低。", "alert");
      return;
    }
    if (sim.gain > 120) {
      setCoach("PMT（光电倍增管）增益偏高，荧光容易饱和，峰会挤到边上。这只是定性示意，真实的电压/增益范围以仪器为准。", "alert");
      return;
    }
    if (sim.acquiring && sim.type === "beads") {
      setCoach("校准微球应该挤成紧紧的一小团，荧光峰又窄又尖，日常质控就靠它。FSC ≈ 相对大小，SSC ≈ 颗粒度，荧光 ≈ 标记信号。", "ok");
      return;
    }
    if (sim.acquiring && sim.type === "lymph") {
      setCoach("淋巴细胞一般落在 SSC 比较低的地方；单核细胞、粒细胞（如果有）SSC 更高。这是教学用的示意分群，不是真实的某一次血样。", "ok");
      return;
    }
    if (sim.acquiring && sim.type === "apo") {
      setCoach("示意：横轴 Annexin V，纵轴膜完整性染料，常用来分出活细胞、早期凋亡和晚期凋亡/坏死。具体方案按试剂说明和实验设计来。", "ok");
      return;
    }
    setCoach("FSC 看细胞的相对大小，SSC 看细胞里面复不复杂、颗粒多不多，荧光是标记分子被激光照到后发出的光。先把联锁弄好、打开激光，鞘液开得明显比样品流大，再点开始采集。", "");
  }

  function syncSchematic() {
    const f = focusModel();
    const half = f.width / 2;
    $core.setAttribute("points", "150," + (300 + half + 2) + " 150," + (300 - half - 2) + " 560," + (300 - Math.max(2, half * 0.35)) + " 560," + (300 + Math.max(2, half * 0.35)));
    $laserG.style.opacity = sim.laserOn ? "1" : "0.18";
    $beam.setAttribute("opacity", sim.laserOn ? "0.75" : "0.05");
    $apTag.setAttribute("visibility", sim.apertureClosed ? "hidden" : "visible");
    document.getElementById("stat-focus").textContent = f.quality;
    document.getElementById("fl-xlab").textContent = sim.type === "apo" ? "Annexin V（示意）→" : sim.type === "beads" ? "荧光强度 →" : "标记荧光（示意）→";
    document.getElementById("fl-ylab").textContent = sim.type === "apo" ? "膜完整性染料（示意）→" : "计数 →";
    document.getElementById("plot-caption").textContent = sim.type === "apo" ? "FSC–SSC 与双色荧光（示意）" : "FSC–SSC 与荧光直方图";
  }

  for (let i = 0; i < 16; i++) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("r", "4");
    $cells.appendChild(c);
    sim.cells.push({ el: c, x: 90 + Math.random() * 480, phase: Math.random() * 1000 });
  }

  function randn() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

  function makeEvent() {
    if (!sim.laserOn) return null;
    const f = focusModel();
    const j = f.jitter;
    const type = sim.type;
    let fsc, ssc, fl1, fl2, pop;
    if (type === "beads") {
      fsc = 0.42 + randn() * (0.018 + j * 0.12);
      ssc = 0.36 + randn() * (0.016 + j * 0.12);
      fl1 = 0.55 + randn() * (0.02 + j * 0.1);
      fl2 = 0.1 + Math.random() * 0.05;
      pop = "bead";
    } else if (type === "lymph") {
      const r = Math.random();
      if (r < 0.12) { // debris
        fsc = 0.08 + Math.random() * 0.1 + randn() * 0.02;
        ssc = 0.08 + Math.random() * 0.1;
        fl1 = 0.08 + Math.random() * 0.08;
        pop = "debris";
      } else if (r < 0.72) { // lymphocytes
        fsc = 0.32 + randn() * (0.035 + j * 0.1);
        ssc = 0.22 + randn() * (0.03 + j * 0.1);
        fl1 = (Math.random() < 0.65 ? 0.62 : 0.16) + randn() * (0.04 + j * 0.08);
        pop = "lym";
      } else if (r < 0.88) { // monocytes
        fsc = 0.52 + randn() * (0.04 + j * 0.1);
        ssc = 0.42 + randn() * (0.04 + j * 0.1);
        fl1 = 0.5 + randn() * 0.08;
        pop = "mono";
      } else { // granulocytes
        fsc = 0.62 + randn() * (0.05 + j * 0.1);
        ssc = 0.72 + randn() * (0.05 + j * 0.1);
        fl1 = 0.22 + randn() * 0.06;
        pop = "gran";
      }
      fl2 = 0.1;
    } else {
      // apoptotic mix: live / early / late
      const r = Math.random();
      if (r < 0.55) {
        fsc = 0.4 + randn() * (0.04 + j * 0.1);
        ssc = 0.3 + randn() * (0.04 + j * 0.1);
        fl1 = 0.16 + randn() * 0.04; // Annexin V low
        fl2 = 0.16 + randn() * 0.04; // PI/viability low
        pop = "live";
      } else if (r < 0.8) {
        fsc = 0.34 + randn() * (0.05 + j * 0.1);
        ssc = 0.36 + randn() * (0.05 + j * 0.1);
        fl1 = 0.68 + randn() * 0.06;
        fl2 = 0.18 + randn() * 0.05;
        pop = "early";
      } else {
        fsc = 0.28 + randn() * (0.06 + j * 0.12);
        ssc = 0.48 + randn() * (0.06 + j * 0.12);
        fl1 = 0.72 + randn() * 0.06;
        fl2 = 0.7 + randn() * 0.06;
        pop = "late";
      }
    }
    // coincidence when collapsed: smear
    if (f.collapsed && Math.random() < 0.35) {
      fsc += (Math.random() - 0.3) * 0.25;
      ssc += (Math.random() - 0.3) * 0.25;
    }
    const g = sim.gain / 70;
    fl1 = fl1 * g;
    fl2 = fl2 * g;
    fsc = clamp01(fsc);
    ssc = clamp01(ssc);
    if (fsc * 100 < sim.thr) return { reject: true };
    return { fsc, ssc, fl1: Math.max(0, fl1), fl2: Math.max(0, fl2), pop };
  }

  function clearPlots() {
    sim.events = [];
    sim.flEvents = [];
    sim.hist.fill(0);
    sim.evCount = 0;
    sim.evWindow = [];
    document.getElementById("stat-events").textContent = "0";
    document.getElementById("stat-rate").textContent = "0";
    drawPlots();
  }

  function drawGrid(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0A101C";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(244,241,234,0.08)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo((w * i) / 4, 16);
      ctx.lineTo((w * i) / 4, h - 22);
      ctx.moveTo(36, (h * i) / 4);
      ctx.lineTo(w - 12, (h * i) / 4);
      ctx.stroke();
    }
    // threshold line on SS plot only when called from SS
  }

  function drawPlots() {
    const w1 = cvsSS.width, h1 = cvsSS.height;
    drawGrid(ctxSS, w1, h1);
    const ml = 40, mb = 24, mt = 10, mr = 10;
    const pw = w1 - ml - mr, ph = h1 - mt - mb;
    // threshold
    const tx = ml + (sim.thr / 100) * pw;
    ctxSS.strokeStyle = "rgba(213,94,0,0.7)";
    ctxSS.setLineDash([4, 4]);
    ctxSS.beginPath();
    ctxSS.moveTo(tx, mt);
    ctxSS.lineTo(tx, mt + ph);
    ctxSS.stroke();
    ctxSS.setLineDash([]);
    ctxSS.fillStyle = "#D55E00";
    ctxSS.font = "11px ui-monospace, monospace";
    ctxSS.fillText("阈值", Math.min(tx + 4, w1 - 40), mt + 12);

    const colors = {
      bead: "#E69F00",
      debris: "#6E778C",
      lym: "#56B4E9",
      mono: "#009E73",
      gran: "#CC79A7",
      live: "#009E73",
      early: "#E69F00",
      late: "#D55E00"
    };
    sim.events.forEach((ev) => {
      const x = ml + ev.fsc * pw;
      const y = mt + ph - ev.ssc * ph;
      ctxSS.fillStyle = colors[ev.pop] || "#F4F1EA";
      ctxSS.globalAlpha = 0.75;
      ctxSS.fillRect(x, y, 2, 2);
    });
    ctxSS.globalAlpha = 1;
    const legends = {
      beads: [["bead", "校准微球"]],
      lymph: [["debris", "碎屑"], ["lym", "淋巴"], ["mono", "单核"], ["gran", "粒"]],
      apo: [["live", "活细胞"], ["early", "早期凋亡"], ["late", "晚期/坏死"]]
    };
    const items = legends[sim.type] || [];
    items.forEach((it, i) => {
      const x = ml + 8 + i * 90;
      const y = mt + 14;
      ctxSS.fillStyle = colors[it[0]];
      ctxSS.fillRect(x, y, 8, 8);
      ctxSS.fillStyle = "#9AA3B8";
      ctxSS.font = "11px ui-monospace, monospace";
      ctxSS.fillText(it[1], x + 12, y + 8);
    });

    const w2 = cvsFL.width, h2 = cvsFL.height;
    drawGrid(ctxFL, w2, h2);
    const pw2 = w2 - ml - mr, ph2 = h2 - mt - mb;
    if (sim.type === "apo") {
      // quadrant labels
      ctxFL.fillStyle = "#6E778C";
      ctxFL.font = "11px ui-monospace, monospace";
      ctxFL.fillText("活细胞", ml + 8, mt + ph2 - 8);
      ctxFL.fillText("早期凋亡", ml + pw2 * 0.62, mt + ph2 - 8);
      ctxFL.fillText("晚期凋亡/坏死", ml + pw2 * 0.55, mt + 16);
      ctxFL.strokeStyle = "rgba(244,241,234,0.2)";
      ctxFL.beginPath();
      ctxFL.moveTo(ml + pw2 * 0.4, mt);
      ctxFL.lineTo(ml + pw2 * 0.4, mt + ph2);
      ctxFL.moveTo(ml, mt + ph2 * 0.6);
      ctxFL.lineTo(ml + pw2, mt + ph2 * 0.6);
      ctxFL.stroke();
      sim.flEvents.forEach((ev) => {
        const x = ml + Math.min(0.98, ev.fl1) * pw2;
        const y = mt + ph2 - Math.min(0.98, ev.fl2) * ph2;
        ctxFL.fillStyle = colors[ev.pop] || "#F4F1EA";
        ctxFL.globalAlpha = 0.75;
        ctxFL.fillRect(x, y, 2, 2);
      });
      ctxFL.globalAlpha = 1;
    } else {
      let max = 1;
      for (let i = 0; i < sim.hist.length; i++) if (sim.hist[i] > max) max = sim.hist[i];
      const bw = pw2 / sim.hist.length;
      ctxFL.fillStyle = "#56B4E9";
      for (let i = 0; i < sim.hist.length; i++) {
        const bh = (sim.hist[i] / max) * (ph2 - 4);
        ctxFL.globalAlpha = 0.9;
        ctxFL.fillRect(ml + i * bw + 0.5, mt + ph2 - bh, Math.max(1, bw - 1), bh);
      }
      ctxFL.globalAlpha = 1;
      if (sim.gain > 120) {
        ctxFL.fillStyle = "#D55E00";
        ctxFL.font = "11px ui-monospace, monospace";
        ctxFL.fillText("饱和区（示意）", ml + pw2 - 90, mt + 14);
      }
    }
  }

  sim.resize = function () {
    [cvsSS, cvsFL].forEach((c) => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(200, Math.floor(r.width * dpr));
      const h = Math.max(120, Math.floor(r.height * dpr));
      if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    });
    drawPlots();
  };

  function ratePerSec() {
    const f = focusModel();
    return 8 + sim.sample * 0.9 * (f.collapsed ? 1.15 : 1);
  }

  let acc = 0, lastT = performance.now();
  function loop(t) {
    const dt = Math.min(0.05, (t - lastT) / 1000);
    lastT = t;
    const f = focusModel();
    const speed = 40 + sim.sheath * 1.6 + sim.sample * 0.4;
    sim.cells.forEach((c, i) => {
      c.x += speed * dt * (0.8 + (i % 3) * 0.08);
      if (c.x > 600) c.x = 90;
      const wander = (Math.sin(t * 0.003 + c.phase) * 0.5 + Math.sin(t * 0.01 + i)) * f.width * 0.55 * (0.25 + f.jitter);
      const y = 300 + wander;
      const r = sim.type === "beads" ? 3.2 : 4.2 + (i % 4) * 0.4;
      c.el.setAttribute("cx", c.x.toFixed(1));
      c.el.setAttribute("cy", y.toFixed(1));
      c.el.setAttribute("r", String(r));
      const nearLaser = Math.abs(c.x - 400) < 10 && sim.laserOn;
      c.el.setAttribute("fill", nearLaser ? "#F0E442" : "#E69F00");
      c.el.setAttribute("opacity", sim.acquiring || true ? "0.95" : "0.7");
    });

    if (sim.acquiring && sim.laserOn && interlockOk()) {
      acc += ratePerSec() * dt;
      while (acc >= 1) {
        acc -= 1;
        const ev = makeEvent();
        if (!ev) continue;
        if (ev.reject) continue;
        sim.events.push(ev);
        sim.flEvents.push(ev);
        sim.evCount++;
        const bin = Math.min(sim.hist.length - 1, Math.max(0, Math.floor(Math.min(ev.fl1, 1.4) / 1.4 * sim.hist.length)));
        sim.hist[bin]++;
        sim.evWindow.push(t);
        if (sim.events.length > 4000) sim.events.splice(0, sim.events.length - 4000);
        if (sim.flEvents.length > 4000) sim.flEvents.splice(0, sim.flEvents.length - 4000);
      }
    } else {
      acc = 0;
    }
    sim.evWindow = sim.evWindow.filter((x) => t - x < 1000);
    document.getElementById("stat-events").textContent = String(sim.evCount);
    document.getElementById("stat-rate").textContent = String(sim.evWindow.length);
    if (sim.acquiring) drawPlots();
    requestAnimationFrame(loop);
  }

  function tryStart() {
    if (!interlockOk()) {
      sim.acquiring = false;
      document.getElementById("btn-acq").textContent = "开始采集";
      document.getElementById("btn-acq").classList.add("primary");
      updateCoachAuto();
      return false;
    }
    if (!sim.laserOn) {
      updateCoachAuto();
      // allow "start" but nothing useful records — still set acquiring so user sees rate 0 and coach
    }
    sim.acquiring = !sim.acquiring;
    document.getElementById("btn-acq").textContent = sim.acquiring ? "停止采集" : "开始采集";
    document.getElementById("btn-acq").classList.toggle("primary", !sim.acquiring);
    updateCoachAuto();
    return true;
  }

  document.getElementById("btn-acq").addEventListener("click", tryStart);
  document.getElementById("btn-clear").addEventListener("click", clearPlots);

  function bindSlider(el, out, key) {
    const sync = () => {
      sim[key] = Number(el.value);
      out.textContent = el.value;
      syncSchematic();
      updateCoachAuto();
    };
    el.addEventListener("input", sync);
    sync();
  }
  bindSlider($sheath, document.getElementById("sheath-out"), "sheath");
  bindSlider($sample, document.getElementById("sample-out"), "sample");
  bindSlider($gain, document.getElementById("gain-out"), "gain");
  bindSlider($thr, document.getElementById("thr-out"), "thr");

  document.querySelectorAll("#sample-type button").forEach((b) => {
    b.addEventListener("click", () => {
      sim.type = b.dataset.type;
      document.querySelectorAll("#sample-type button").forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
      clearPlots();
      syncSchematic();
      updateCoachAuto();
    });
  });

  document.getElementById("btn-laser").addEventListener("click", function () {
    sim.laserOn = !sim.laserOn;
    this.textContent = sim.laserOn ? "激光：开" : "激光：关";
    this.setAttribute("aria-pressed", sim.laserOn ? "true" : "false");
    this.classList.toggle("ok", sim.laserOn);
    this.classList.toggle("warn", !sim.laserOn);
    syncSchematic();
    updateCoachAuto();
  });
  document.getElementById("btn-aperture").addEventListener("click", function () {
    sim.apertureClosed = !sim.apertureClosed;
    this.textContent = sim.apertureClosed ? "光阑：关好了" : "光阑：开着";
    this.setAttribute("aria-pressed", sim.apertureClosed ? "true" : "false");
    this.classList.toggle("ok", sim.apertureClosed);
    this.classList.toggle("warn", !sim.apertureClosed);
    if (!sim.apertureClosed && sim.acquiring) {
      sim.acquiring = false;
      document.getElementById("btn-acq").textContent = "开始采集";
      document.getElementById("btn-acq").classList.add("primary");
    }
    syncSchematic();
    updateCoachAuto();
  });
  document.getElementById("btn-waste").addEventListener("click", function () {
    sim.wasteReady = !sim.wasteReady;
    this.textContent = sim.wasteReady ? "废液桶：接好了" : "废液桶：没接";
    this.setAttribute("aria-pressed", sim.wasteReady ? "true" : "false");
    this.classList.toggle("ok", sim.wasteReady);
    this.classList.toggle("warn", !sim.wasteReady);
    if (!sim.wasteReady && sim.acquiring) {
      sim.acquiring = false;
      document.getElementById("btn-acq").textContent = "开始采集";
      document.getElementById("btn-acq").classList.add("primary");
    }
    updateCoachAuto();
  });

  /* 演示脚本：适合被临时点到的同学 */
  document.getElementById("btn-demo").addEventListener("click", function () {
    if (sim.demoTimer) {
      clearTimeout(sim.demoTimer);
      sim.demoTimer = 0;
      this.textContent = "演示脚本";
      updateCoachAuto();
      return;
    }
    const steps = [
      () => {
        setCoach("演示开始：先把联锁调到安全状态——光阑关好、废液桶接好，再打开激光。", "ok");
        if (!sim.apertureClosed) document.getElementById("btn-aperture").click();
        if (!sim.wasteReady) document.getElementById("btn-waste").click();
        if (!sim.laserOn) document.getElementById("btn-laser").click();
        $sheath.value = 75; $sample.value = 22; $gain.value = 70; $thr.value = 8;
        $sheath.dispatchEvent(new Event("input")); $sample.dispatchEvent(new Event("input"));
        $gain.dispatchEvent(new Event("input")); $thr.dispatchEvent(new Event("input"));
        document.querySelector('#sample-type [data-type="beads"]').click();
      },
      () => {
        setCoach("用校准微球、鞘液比样品流大，开始采集。看：FSC–SSC 图上是紧紧的一小团点，直方图上是一个很窄的荧光峰。", "ok");
        if (!sim.acquiring) tryStart();
      },
      () => {
        setCoach("现在把样品流开大——中间的芯流变粗，细胞不再一个个排队，点图就散了。这是最常见的“翻车”情况。", "alert");
        $sample.value = 92;
        $sample.dispatchEvent(new Event("input"));
      },
      () => {
        setCoach("把样品流调回来，点图又会收紧。接着关掉激光：就算还在“采集”，也没有有效信号进来。", "alert");
        $sample.value = 22;
        $sample.dispatchEvent(new Event("input"));
        clearPlots();
        if (sim.laserOn) document.getElementById("btn-laser").click();
      },
      () => {
        if (!sim.laserOn) document.getElementById("btn-laser").click();
        setCoach("最后看联锁：把光阑打开，采集就被拦住了。真实仪器也一样，防护打开时不允许继续工作。", "alert");
        if (sim.acquiring) tryStart();
        if (sim.apertureClosed) document.getElementById("btn-aperture").click();
        tryStart();
      },
      () => {
        if (!sim.apertureClosed) document.getElementById("btn-aperture").click();
        setCoach("演示结束。可以换成“淋巴细胞”或“凋亡混合样”，或者自己再调调流速和增益。", "ok");
        document.getElementById("btn-demo").textContent = "演示脚本";
        sim.demoTimer = 0;
      }
    ];
    this.textContent = "停止脚本";
    let i = 0;
    const run = () => {
      if (i >= steps.length) return;
      steps[i]();
      i++;
      if (i < steps.length) sim.demoTimer = setTimeout(run, 5200);
      else sim.demoTimer = 0;
    };
    run();
  });

  window.addEventListener("resize", () => sim.resize());
  setTimeout(() => sim.resize(), 80);
  updateCoachAuto();
  syncSchematic();
  requestAnimationFrame(loop);

  help.addEventListener("click", (e) => { if (e.target === help) help.classList.remove("on"); });
  overview.addEventListener("click", (e) => { if (e.target === overview) overview.classList.remove("on"); });

  go(parseHash(), "init");
})();
