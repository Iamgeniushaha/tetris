
// -------------------------------------------------------------
let block_list = [];

function createFallingItem() {
    const item = document.createElement("div");
    item.classList.add("falling-item");

    const randomX = Math.random() * (window.innerWidth * 0.3) + (window.innerWidth * 0.05);
    const randomY = Math.random() * (window.innerHeight * 0.01) + (window.innerHeight * 0.2);
    const randomAngle = Math.random() * 360;

    item.style.left = `${randomX}px`;
    item.style.top = `${randomY}px`;
    item.style.transform = `rotate(${randomAngle}deg)`;

    let random_block;
    do {
        random_block = Math.floor(Math.random() * 7) + 1;
    } while (block_list.includes(random_block));

    block_list.push(random_block);
    if (block_list.length === 7) block_list = [];

    const svgMap = {
        1: `
<svg width="38" height="57" viewBox="0 0 190 285" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="94" height="94" rx="47" fill="#684848"/>
<rect x="0.5" y="0.5" width="94" height="94" rx="47" stroke="#DED6D6"/>
<rect x="0.5" y="0.5" width="94" height="94" rx="9.5" fill="#D96B3C" stroke="black"/>
<rect x="0.5" y="190.5" width="94" height="94" rx="47" fill="#684848"/>
<rect x="0.5" y="190.5" width="94" height="94" rx="47" stroke="#DED6D6"/>
<rect x="0.5" y="190.5" width="94" height="94" rx="9.5" fill="#D96B3C" stroke="black"/>
<rect x="95.5" y="190.5" width="94" height="94" rx="47" fill="#684848"/>
<rect x="95.5" y="190.5" width="94" height="94" rx="47" stroke="#DED6D6"/>
<rect x="95.5" y="190.5" width="94" height="94" rx="9.5" fill="#D96B3C" stroke="black"/>
<rect x="0.5" y="95.5" width="94" height="94" rx="47" fill="#684848"/>
<rect x="0.5" y="95.5" width="94" height="94" rx="47" stroke="#DED6D6"/>
<rect x="0.5" y="95.5" width="94" height="94" rx="9.5" fill="#D96B3C" stroke="black"/>
</svg>`,
        2: `
<svg width="38" height="57" viewBox="0 0 190 285" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="95.5" y="0.5" width="94" height="94" rx="9.5" fill="#3C44D9" stroke="black"/>
<rect x="95.5" y="95.5" width="94" height="94" rx="9.5" fill="#3C44D9" stroke="black"/>
<rect x="95.5" y="190.5" width="94" height="94" rx="9.5" fill="#3C44D9" stroke="black"/>
<rect x="0.5" y="190.5" width="94" height="94" rx="9.5" fill="#3C44D9" stroke="black"/>
</svg>
`,
        3: `
            <svg width="19" height="76" viewBox="0 0 95 380" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="94" height="94" rx="47" fill="#684848"/>
<rect x="0.5" y="0.5" width="94" height="94" rx="47" stroke="#DED6D6"/>
<rect x="0.5" y="0.5" width="94" height="94" rx="9.5" fill="#3CC9D9" stroke="black"/>
<rect x="0.5" y="95.5" width="94" height="94" rx="9.5" fill="#3CC9D9" stroke="black"/>
<rect x="0.5" y="190.5" width="94" height="94" rx="9.5" fill="#3CC9D9" stroke="black"/>
<rect x="0.5" y="285.5" width="94" height="94" rx="9.5" fill="#3CC9D9" stroke="black"/>
</svg>

        `,
        4: `
<svg width="85" height="56" viewBox="0 0 88 131" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="87.5" y="44.1667" width="42.6667" height="43" rx="9.5" transform="rotate(90 87.5 44.1667)" fill="#D93CD9" stroke="black"/>
<rect x="43.5" y="44.1667" width="42.6667" height="43" rx="9.5" transform="rotate(90 43.5 44.1667)" fill="#D93CD9" stroke="black"/>
<rect x="43.5" y="0.5" width="42.6667" height="43" rx="9.5" transform="rotate(90 43.5 0.5)" fill="#D93CD9" stroke="black"/>
<rect x="43.5" y="87.8333" width="42.6667" height="43" rx="9.5" transform="rotate(90 43.5 87.8333)" fill="#D93CD9" stroke="black"/>
</svg>`,
        5: `
            <svg width="57" height="38" viewBox="0 0 285 190" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="95.5" y="95.5" width="94" height="94" rx="9.5" fill="#51D93C" stroke="black"/>
<rect x="0.5" y="95.5" width="94" height="94" rx="9.5" fill="#51D93C" stroke="black"/>
<rect x="95.5" y="0.5" width="94" height="94" rx="9.5" fill="#51D93C" stroke="black"/>
<rect x="190.5" y="0.5" width="94" height="94" rx="9.5" fill="#51D93C" stroke="black"/>
</svg>
`,
        6: `
            <svg width="38" height="38" viewBox="0 0 190 190" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="94" height="94" rx="9.5" fill="#D9C43C" stroke="black"/>
<rect x="0.5" y="95.5" width="94" height="94" rx="9.5" fill="#D9C43C" stroke="black"/>
<rect x="95.5" y="0.5" width="94" height="94" rx="9.5" fill="#D9C43C" stroke="black"/>
<rect x="95.5" y="95.5" width="94" height="94" rx="9.5" fill="#D9C43C" stroke="black"/>
</svg>
`,
        7: `
            <svg width="38" height="38" viewBox="0 0 190 190" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="94" height="94" rx="9.5" fill="#D9C43C" stroke="black"/>
<rect x="0.5" y="95.5" width="94" height="94" rx="9.5" fill="#D9C43C" stroke="black"/>
<rect x="95.5" y="0.5" width="94" height="94" rx="9.5" fill="#D9C43C" stroke="black"/>
<rect x="95.5" y="95.5" width="94" height="94" rx="9.5" fill="#D9C43C" stroke="black"/>
</svg>
`
    };


    item.innerHTML = svgMap[random_block] || "";
    document.body.appendChild(item);
    setTimeout(() => item.remove(), 4000);
}
setInterval(createFallingItem, 300);
////////////////////////////////////////////////////////////////////
