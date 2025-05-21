// 별 생성 함수 (별이 twinkle 애니메이션 반복 시 위치 변경)
function generateStars(numStars) {
    const starfield = document.getElementById("starfield");
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        // 별의 초기 크기 (1px ~ 3px)
        const size = Math.random() * 2 + 1;
        star.style.width = size + "px";
        star.style.height = size + "px";
        // 초기 위치 설정
        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";
        // 별 애니메이션 속도 랜덤 (1.5s ~ 3s)
        const duration = Math.random() * 1.5 + 1.5;
        star.style.animationDuration = duration + "s";
        // 애니메이션 반복할 때마다 위치 랜덤 변경
        star.addEventListener("animationiteration", function() {
            star.style.top = Math.random() * 100 + "%";
            star.style.left = Math.random() * 100 + "%";
        });
        starfield.appendChild(star);
    }
}
// 별 150개 생성
generateStars(150);
