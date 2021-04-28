import os
from re import search
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from time import sleep
import keyboard

# PATH_TO_CHROMEDRIVER = 'path'
# # path to home
# HOME = 'C:\\Users\\{username}\\'
# EMAIL = 'your@gmail.com'
# PASSWORD = 'yourPassword'
# SEARCH = 'Figure Drawing Poses'
# DOWNLOAD = True
# SPEED = 2
# # Path to folder where your gonna download the images
# PATH = 'folder'
# # how much groups of images
# # 1 group is like 6 images
# AMT_SET_IMG = 20


class Pinterest():
    def __init__(self, email, password,  url='C:\\Program Files (x86)\\chromedriver'):
        self.options = webdriver.ChromeOptions()
        # self.options.add_argument('headless')
        self.options.add_argument('--window-size=500x500')
        self.driver = webdriver.Chrome(url, options=self.options)
        self.email = email
        self.password = password

    def _login(self):
        self.driver.get("https://www.pinterest.com/")
        login_btn = self.driver.find_element_by_class_name('RCK')
        login_btn.click()
        sleep(3)
        print("login in...")
        keyboard.write(self.email)
        keyboard.press_and_release('tab')
        keyboard.write(self.password)
        keyboard.press_and_release('enter')
        sleep(5)

    def get_board_pins(self, board='https://www.pinterest.com/ban_low_key/pins/', amt_set_imgs=10, path='figure-drawing\\pinterest-images'):
        img_srcs = []
        self._login()
        self.driver.get(board)
        print("Getting Pins From Board")
        for i in range(amt_set_imgs):
            sleep(SPEED)
            self.driver.execute_script(
                "window.scrollTo(0, document.body.scrollHeight);")

            imgs = self.driver.find_elements_by_tag_name("img")

            for img in imgs:
                try:
                    if len(img.get_attribute('srcset').split(' ')) >= 2:
                        attribute = img.get_attribute('srcset').split(' ')[-2]
                    else:
                        attribute = img.get_attribute('srcset')
                    # Filter out repeated attributes
                    if not attribute in img_srcs:
                        img_srcs.append(attribute)
                except:
                    print('failed to get img src')

        self._close_window()
        pin.store_img_links(HOME + path, img_srcs)
        return img_srcs

    def searchPins(self, message="figure drawing poses", amt_set_imgs=20, download=True, path='figure-drawing\\pinterest-images'):
        img_srcs = []
        data_test_id = 'homefeed-feed'
        self._login()
        if(message != 'homefeed'):
            print(f"Searching for {message}...")
            data_test_id = 'search-feed'
            self.driver.get(
                f'https://www.pinterest.com/search/pins/?q={message}&rs=typed&term_meta[]=test%7Ctyped')

        for i in range(amt_set_imgs):
            sleep(SPEED)
            self.driver.execute_script(
                "window.scrollTo(0, document.body.scrollHeight);")

            search_result = WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.XPATH, f"//div[@data-test-id='{data_test_id}']")))

            imgs = search_result.find_elements_by_tag_name("img")
            for img in imgs:
                try:
                    if len(img.get_attribute('srcset').split(' ')) >= 2:
                        attribute = img.get_attribute('srcset').split(' ')[-2]
                    else:
                        attribute = img.get_attribute('srcset')
                    # Filter out repeated attributes
                    if not attribute in img_srcs:
                        img_srcs.append(attribute)
                except:
                    print('failed to get img src')

        self._close_window()
        if download == True:
            pin.store_img_links(
                HOME + path, img_srcs)
        return img_srcs

    def store_img_links(self, folder, links):
        print(f"storing images at {folder}...")
        for link in links:
            img_file_name = link.split('/')[-1]
            if img_file_name:
                with open(os.path.join(folder, img_file_name), 'wb') as f:
                    f.write(self._readimg(link))

    def _readimg(self, url):
        import urllib.request
        with urllib.request.urlopen(url) as response:
            return response.read()

    def _close_window(self):
        # self.driver.close()
        self.driver.quit()


if __name__ == '__main__':
    pin = Pinterest(EMAIL, PASSWORD, url=PATH_TO_CHROMEDRIVER)
    # result = pin.searchPins(
    #     message=SEARCH, amt_set_imgs=AMT_SET_IMG, download=DOWNLOAD, path=PATH)

    results = pin.get_board_pins(
        board=BOARD, amt_set_imgs=AMT_SET_IMG, path=PATH)
    print("quitting...")
