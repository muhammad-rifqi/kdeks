let cookie = {};
var a = document.cookie.split(";");
for (var i = 0; i < a.length; i++) {
    var b = a[i].split("=");
    var [key, value] = b;
    cookie[key.trim()] = value;
}
    document.write(`<nav class="nxl-navigation">
        <div class="navbar-wrapper">
            <div class="m-header">
                <a href="/" class="b-brand">
                    <!-- ========   change your logo hear   ============ -->
                    <img src="/assets/images/logo_kneks.png" alt="" class="logo logo-lg" width="100" />
                    <img src="/assets/images/logo-abbr.png" alt="" class="logo logo-sm" />
                </a>
            </div>
            <div class="navbar-content">
                <ul class="nxl-navbar">
                    <li class="nxl-item nxl-caption">
                        <label>Dashboard</label>
                    </li>
                    <li class="nxl-item nxl-hasmenu">
                        <a href="javascript:void(0);" class="nxl-link">
                            <span class="nxl-micon"><i class="feather-bookmark"></i></span>
                            <span class="nxl-mtext">News Management</span><span class="nxl-arrow"><i class="feather-chevron-right"></i></span>
                        </a>
                        <ul class="nxl-submenu">
                            <li class="nxl-item"><a class="nxl-link" href="/news">News</a></li>
                            <li class="nxl-item"><a class="nxl-link" href="/news_category">News Category</a></li>
                        </ul>
                    </li>
                    <li class="nxl-item nxl-hasmenu">
                        <a href="javascript:void(0);" class="nxl-link">
                            <span class="nxl-micon"><i class="feather-user"></i></span>
                            <span class="nxl-mtext">Profile</span><span class="nxl-arrow"><i class="feather-chevron-right"></i></span>
                        </a>
                        <ul class="nxl-submenu">
                            <li class="nxl-item"><a class="nxl-link" href="/tentangkami">Tentang Kami</a></li>
                            <li class="nxl-item"><a class="nxl-link" href="/sejarah">Sejarah</a></li>
                            <li class="nxl-item"><a class="nxl-link" href="/sk">SK</a></li>
                            <li class="nxl-item"><a class="nxl-link" href="/video">Video</a></li>
                            <li class="nxl-item"><a class="nxl-link" href="/photo">Photo</a></li>
                        </ul>
                    </li>
                    <li class="nxl-item">
                        <a class="nxl-link" href="/agenda">
                            <span class="nxl-micon"><i class="feather-calendar"></i></span>
                            <span class="nxl-mtext">Agenda</span>
                        </a>
                    </li>
                     <li class="nxl-item nxl-hasmenu">
                        <a href="javascript:void(0);" class="nxl-link">
                            <span class="nxl-micon"><i class="feather-book"></i></span>
                            <span class="nxl-mtext">E-Library</span><span class="nxl-arrow"><i class="feather-chevron-right"></i></span>
                        </a>
                        <ul class="nxl-submenu">
                            <li class="nxl-item"><a class="nxl-link" href="/elibrary">E-Library</a></li>
                        </ul>
                    </li>
                    <li class="nxl-item">
                        <a class="nxl-link" href="/opini">
                            <span class="nxl-micon"><i class="feather-droplet"></i></span>
                            <span class="nxl-mtext">Opini</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>`);


