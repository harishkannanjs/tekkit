
import os
from bs4 import BeautifulSoup
import re

files = [
    "Vibe_Coding_Mastery.html",
    "apply-now.html",
    "contact.html",
    "courses.html",
    "index.html",
    "pricing.html",
    "privacy_policy.html",
    "terms_and_conditions.html",
    "waiting_page.html"
]

base_path = r"d:\Develop\Tekkit\tekkit-main\tekkit-main"

def verify_footer(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    soup = BeautifulSoup(content, "html.parser")
    
    footer_container = soup.find(id="brxe-byhlqf")
    if not footer_container:
        return False, "Footer container #brxe-byhlqf not found"
        
    # Check for inline style or style tag
    # Since I added a <style> tag inside the div in some cases or modifying the head?
    # I added <style> tag INSIDE the #brxe-byhlqf div in my edits.
    
    style_tag = footer_container.find("style")
    if not style_tag:
        return False, "Embedded <style> tag not found within #brxe-byhlqf"
    
    if "flex-direction: column" not in style_tag.text:
         return False, "Style does not contain 'flex-direction: column' for #brxe-byhlqf"
         
    if "#footer-links-group" not in style_tag.text:
         return False, "Style does not contain rules for #footer-links-group"

    # Check structure
    footer_links_group = footer_container.find(id="footer-links-group")
    if not footer_links_group:
        return False, "Div #footer-links-group not found"
        
    # Check course links inside group
    course_links = footer_links_group.find_all("a", href=True)
    if len(course_links) < 2:
         return False, f"Expected at least 2 course links in group, found {len(course_links)}"
         
    # Check contact link
    # Contact link should be a direct child of #brxe-byhlqf (or wrapper) appearing AFTER #footer-links-group
    
    # Get all direct children of brxe-byhlqf (excluding style)
    children = [child for child in footer_container.contents if child.name == "div"]
    
    # We expect [footer-links-group, contact-div]
    if len(children) < 2:
         return False, f"Expected at least 2 main div children in footer, found {len(children)}"
         
    if children[0].get("id") != "footer-links-group":
         return False, "First div child is not #footer-links-group"
         
    contact_div = children[1]
    contact_link = contact_div.find("a", href=lambda h: h and "contact.html" in h)
    
    if not contact_link:
        return False, "Contact link not found in the second div"
        
    return True, "Verified"

print("Verifying footer structure...")
all_passed = True
for filename in files:
    path = os.path.join(base_path, filename)
    if not os.path.exists(path):
        print(f"File not found: {filename}")
        continue
        
    success, message = verify_footer(path)
    if success:
        print(f"[PASS] {filename}")
    else:
        print(f"[FAIL] {filename}: {message}")
        all_passed = False

if all_passed:
    print("\nAll files verified successfully!")
else:
    print("\nSome files failed verification.")
