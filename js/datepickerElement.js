class Dpr extends HTMLElement {

    CreateList(year) {
        let result = '<ul id = "list_year">';
        for(let i = 1990; i <= 2050; i++) {
            year = parseInt(year);
            if(i === year) result += '<li class = "li_sel">' + i + '<li>';
            else result += '<li>' + i + '<li>';
        }
        result += '</ul>';
        return result;
    }

    generateMounth(mounth, mno) {
        let result = '<table id = "list_mounth">';
        let can = 0;
        for(let i = 0; i < 4; i++) {
            mounth = parseInt(mounth);
            result += '<tr>';
            for(let j = 0;j < 3;j++) {
                if (can === mounth) result += '<td class = "tdh"><span class = "sp1">' + mno[can++].toUpperCase() + '</span><td>';
                else result += '<td class = "tdh"><span class = "sp">' + mno[can++].toUpperCase() + '</span><td>';
            }
            result += '</tr>';
        }
        result += '</table>';
        return result;
    }

    generateDate(month, year, da) {
        let sdo = new Date(year, month, 1).getDay() * -1 + 1;
        let ans = ''; let ok = 0; let cnt = 0;
        let d = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        ans += '<table id = "tbd">';
        ans += '<tr>';
        for(let i = 0;i <= 6;i++) ans += '<th>' + d[i] + '</th>';
        ans += '</tr>';
        for(let i = 0; i < 6; i++) {
            ans += '<tr>';
            for(let j = 0; j < 7; j++) {
                let d = new Date(year, month, cnt + sdo);
                if(d.getDate() === 1 && ok === 1) ok = -1;
                if(d.getDate() === 1 && ok === 0) ok = 1;
                if(ok !== 1) ans += `<td> </td>`;
                else {
                    if (d.getMonth() === month && d.getDate() === da) ans += `<td class = "Chd">${d.getDate()}</td>`;
                    else ans += `<td class = "noChd">${d.getDate()}</td>`;
                }
                cnt++;
            }
            ans += '</tr>';
        }
        ans += '</table>';
        return ans;
    }

    showDTMY(d, m, y) {
        let ans = '';
        let mno_full = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        for(let i of this.arrFormat) {
            if (i === 'd') ans += ((d >= 10) ? d : "0" + d);
            if (i === 'm') ans += ((m + 1 >= 10) ? m + 1 : "0" + (m + 1));
            if (i === 'n') ans += mno_full[m];
            if (i === 'y') ans += y;
            if(this.arrFormat[this.arrFormat.length - 1] !== i)ans += this.dev;
        }
        return ans;
    }

    updateTableDays(sd, shdm, d, m, y) {
        sd.innerHTML = this.generateDate(m, y, d);
        let tbdddd = this.shadowRoot.getElementById('tbd');
        tbdddd.onclick = (e) => {
            if(e.target.innerText.length > 0) {
                this.fdate = parseInt(e.target.innerText);
                this.cur_fdate = this.fdate; this.cur_fmounth = this.fmounth; this.cur_fyear = this.fyear;
                shdm.innerHTML = this.showDTMY(this.fdate, m, y);
                this.updateTableDays(sd, shdm, this.fdate, m, y);
            }
        };
    }

    solve() {
        let mf = this.shadowRoot.getElementById('main_form');
        let shdm = this.shadowRoot.getElementById('show_dmy');
        let cn = this.shadowRoot.getElementById('can');
        let ym = this.shadowRoot.getElementById('year_m');
        let wm = this.shadowRoot.getElementById('wmd_m');
        let mtf = this.shadowRoot.getElementById('mth_form');
        let mth = this.shadowRoot.getElementById('mth_coll');
        let sd = this.shadowRoot.getElementById('show_date');
        let cs = this.shadowRoot.getElementById('cms');

        let nx = this.shadowRoot.getElementById('nxt');
        let pv = this.shadowRoot.getElementById('prev');

        mf.addEventListener('click', () => {
            if(cn.innerText === '▼') {
                cs.style.display = 'block';
                cn.innerText = '▲';
            }
            else {
                cs.style.display = '';
                cn.innerText = '▼';
            }
        });

        let d = ['Stu', 'Mon', 'Tue', 'Wen', 'Thu', 'Fry', 'Sun'];
        let mno = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        let mno_full = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        let date = new Date();
        let pr = this.fyear; let kp = true;
        ym.innerHTML = date.getFullYear();
        wm.innerHTML = d[date.getDay()] + ', ' + mno[date.getMonth()] + ' ' + date.getDate();

        mtf.innerHTML = mno_full[this.fmounth] + ' ' + this.fyear;

        shdm.innerHTML = this.showDTMY(this.fdate, this.fmounth, this.fyear);

        this.updateTableDays(sd, shdm, this.fdate, this.fmounth, this.fyear);

        nx.addEventListener('click', () => {
            if(mtf.innerText.length !== 4) {
                if(this.fmounth === 11) {this.fmounth = 0; this.fyear++;}
                else this.fmounth++;
                mtf.innerHTML = mno_full[this.fmounth] + ' ' + this.fyear;
                this.updateTableDays(sd, shdm, (this.fmounth === this.cur_fmounth && this.fyear === this.cur_fyear) ? this.cur_fdate : -1, this.fmounth, this.fyear);
            } else {
                if(this.fyear === 2050) {this.fyear = 1990;}
                else this.fyear++;
                mtf.innerHTML = this.fyear;
            }
        });

        pv.addEventListener('click', () => {
            if(mtf.innerText.length !== 4) {
                if(this.fmounth === 0) {this.fmounth = 11; this.fyear--;}
                else this.fmounth--;
                mtf.innerHTML = mno_full[this.fmounth] + ' ' + this.fyear;
                this.updateTableDays(sd, shdm, (this.fmounth === this.cur_fmounth && this.fyear === this.cur_fyear) ? this.cur_fdate : -1, this.fmounth, this.fyear);
            } else {
                if(this.fyear === 1990) {this.fyear = 2050;}
                else this.fyear--;
                mtf.innerHTML = this.fyear;
            }
        });

        ym.addEventListener('click', () => {
            sd.innerHTML = this.CreateList(this.fyear);
            let ly = this.shadowRoot.getElementById('list_year');
            ly.scrollTop = (pr - 1994) * 21 + (pr - 1994) * 15;
            mth.style.display = 'none';
            ly.addEventListener('click', (e) => {
                if (e.target.tagName === 'LI') {
                    let all_li = this.shadowRoot.querySelectorAll('li');
                    all_li[(pr - 1990) * 2].removeAttribute('class');
                    e.target.setAttribute('class', 'li_sel');
                    pr = parseInt(e.target.innerText); kp = false;
                    this.fyear = pr; ym.innerText = this.fyear;
                    shdm.innerHTML = this.showDTMY(this.fdate, this.fmounth, this.fyear);
                }
            });
            shdm.innerHTML = this.showDTMY(this.fdate, this.fmounth, this.fyear);
        });

        wm.addEventListener('click', () => {
            mth.style.display = 'block';
            this.updateTableDays(sd, shdm, (this.fmounth === this.cur_fmounth && this.fyear === this.cur_fyear) ? this.cur_fdate : -1, this.fmounth, this.fyear);
            mtf.innerHTML = mno_full[this.fmounth] + ' ' + this.fyear;
        });

        mtf.addEventListener('click', () => {
            sd.innerHTML = this.generateMounth(this.fmounth, mno);
            let td = this.shadowRoot.querySelectorAll('td');
            for(let i of td) {
                if(i.innerText.length === 0) i.parentNode.removeChild(i);
            }
            let lm = this.shadowRoot.getElementById('list_mounth');
            mtf.innerHTML = this.fyear;
            lm.addEventListener('click', (e) => {
                if(e.target.tagName === 'SPAN') {
                    let str = e.target.innerText[0];
                    for(let i = 1;i < e.target.innerText.length;i++) str += e.target.innerText.toLowerCase(e.target.innerText.length - 1)[i];
                    this.fmounth = mno.indexOf(str);
                    this.updateTableDays(sd, shdm, (this.fmounth === this.cur_fmounth && this.fyear === this.cur_fyear) ? this.cur_fdate : -1, this.fmounth, this.fyear);
                    mtf.innerHTML = mno_full[this.fmounth] + ' ' + this.fyear;
                }
            });
        });
    }

    render() {
        this.dev = this.getAttribute('format')[1];
        this.arrFormat = this.getAttribute('format').split(this.dev);
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(tmpl.content.cloneNode(true));
        this.solve();
    }

    constructor() {
        super();
        let date = new Date();

        this.fmounth = date.getMonth();
        this.fyear = date.getFullYear();
        this.fdate = date.getDate();

        this.cur_fmounth = date.getMonth();
        this.cur_fyear = date.getFullYear();
        this.cur_fdate = date.getDate();

        this.arrFormat = [];
        this.dev = '.';
    }

    connectedCallback() {
        if(this.bl === false) {
            this.render();
            this.bl = true;
        }
    }

    static get observedAttributes() {
        return ['format'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

}

customElements.define('date-pinker', Dpr);