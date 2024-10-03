document.write(` <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
        <div class="app-brand demo">
          <a href="#">
            <img src="/assets/img/branding/logo-kneks.png" alt="KNEKS">
          </a>

          <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.47365 11.7183C8.11707 12.0749 8.11707 12.6531 8.47365 13.0097L12.071 16.607C12.4615 16.9975 12.4615 17.6305 12.071 18.021C11.6805 18.4115 11.0475 18.4115 10.657 18.021L5.83009 13.1941C5.37164 12.7356 5.37164 11.9924 5.83009 11.5339L10.657 6.707C11.0475 6.31653 11.6805 6.31653 12.071 6.707C12.4615 7.09747 12.4615 7.73053 12.071 8.121L8.47365 11.7183Z"
                fill-opacity="0.9" />
              <path
                d="M14.3584 11.8336C14.0654 12.1266 14.0654 12.6014 14.3584 12.8944L18.071 16.607C18.4615 16.9975 18.4615 17.6305 18.071 18.021C17.6805 18.4115 17.0475 18.4115 16.657 18.021L11.6819 13.0459C11.3053 12.6693 11.3053 12.0587 11.6819 11.6821L16.657 6.707C17.0475 6.31653 17.6805 6.31653 18.071 6.707C18.4615 7.09747 18.4615 7.73053 18.071 8.121L14.3584 11.8336Z"
                fill-opacity="0.4" />
            </svg>
          </a>
        </div>

        <div class="menu-inner-shadow"></div>

        <ul class="menu-inner py-1">
          <!-- News Management -->
          <li class="menu-item active open">
            <a href="javascript:void(0);" class="menu-link menu-toggle">
              <i class="menu-icon tf-icons ri-newspaper-line"></i>
              <div data-i18n="News Management">News Management</div>
            </a>
            <ul class="menu-sub">
              <li class="menu-item">
                <a href="/news" class="menu-link">
                  <div data-i18n="News">News</div>
                </a>
              </li>
              <li class="menu-item">
                <a href="/news_category" class="menu-link">
                  <div data-i18n="News Categories">News Categories</div>
                </a>
              </li>
            </ul>
          </li>

          <!-- Profile -->
          <li class="menu-item">
            <a href="javascript:void(0);" class="menu-link menu-toggle">
              <i class="menu-icon tf-icons ri-profile-line"></i>
              <div data-i18n="Profile">Profile</div>
            </a>

            <ul class="menu-sub">
              <li class="menu-item">
                <a href="/tentangkami" class="menu-link">
                  <div data-i18n="Tentang Kami">Tentang Kami</div>
                </a>
              </li>
              <li class="menu-item">
                <a href="/sejarah" class="menu-link">
                  <div data-i18n="Sejarah">Sejarah</div>
                </a>
              </li>
              <li class="menu-item">
                <a href="/sk" class="menu-link">
                  <div data-i18n="SK">SK</div>
                </a>
              </li>
              <li class="menu-item">
                <a href="/video" class="menu-link" target="_blank">
                  <div data-i18n="Video">Video</div>
                </a>
              </li>
              <li class="menu-item">
                <a href="/photo" class="menu-link">
                  <div data-i18n="Photos">Photos</div>
                </a>
              </li>
            </ul>
          </li>

          <!-- Agenda -->
          <li class="menu-item">
            <a href="/agenda" class="menu-link">
              <i class="menu-icon tf-icons ri-calendar-line"></i>
              <div data-i18n="Agenda">Agenda</div>
            </a>
          </li>

          <!-- Home Management -->
          <li class="menu-item">
            <a href="javascript:void(0);" class="menu-link menu-toggle">
              <i class="menu-icon tf-icons ri-home-office-line"></i>
              <div data-i18n="Home Management">Home Management</div>
            </a>
            <ul class="menu-sub">
              <li class="menu-item">
                <a href="/home_management" class="menu-link">
                  <div data-i18n="Home">Home</div>
                </a>
              </li>

            </ul>
          </li>

          <!-- E-Library -->
          <li class="menu-item">
            <a href="javascript:void(0);" class="menu-link menu-toggle">
              <i class="menu-icon tf-icons ri-book-shelf-line"></i>
              <div data-i18n="E-Library">E-Library</div>
            </a>
            <ul class="menu-sub">
              <li class="menu-item">
                <a href="/elibrary" class="menu-link">
                  <div data-i18n="E-Library">E-Library</div>
                </a>
              </li>
            </ul>
          </li>

          <!-- User Management -->
          <li class="menu-item">
            <a href="javascript:void(0);" class="menu-link menu-toggle">
              <i class="menu-icon tf-icons ri-group-line"></i>
              <div data-i18n="User Management">User Management</div>
            </a>
            <ul class="menu-sub">
              <li class="menu-item">
                <a href="/users" class="menu-link">
                  <div data-i18n="Users">Users</div>
                </a>
              </li>
            </ul>
          </li>

          <!-- Opini -->
          <li class="menu-item">
            <a href="/opini" class="menu-link">
              <i class="menu-icon tf-icons ri-chat-1-line"></i>
              <div data-i18n="Opini">Opini</div>
            </a>
          </li>
        </ul>
      </aside>`);

 