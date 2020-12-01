"""
Renders the main recipe page from the text in the recipes folder and the images in the images folder.
"""

import glob


def main():
	recipe_file = open("recipes.html", "wb")
	recipe_list = sorted(glob.glob("recipes/*.html"))
	image_list = sorted(glob.glob("img/recipes/*.jpg"))

	recipe_html = ""
	for (index, r) in enumerate(recipe_list):
		thumb_lookup = [i for i in image_list if r.replace(".html", "") in i]
		if not thumb_lookup:
			raise LookupError("no thumb for {0}".format(r))
		thumb_file = [i for i in image_list if r.replace(".html", "") in i][0]

		recipe_title = r.replace('recipes/', '').replace('.html', '').replace("_", " ").upper()

		recipe_thumb = """<div class='col-lg-6'>
						<a href='{0}'>
						<img style='height:300px; width: inherit;' src='{1}'>
						<h2 class='centered-title'>{2}</h2>
						</a>
						</div>""".format(r, 
										thumb_file, 
										recipe_title)
		if index % 2 == 0:
			recipe_thumb = "<div class='row'>{0}".format(recipe_thumb)
		else:
			recipe_thumb += "</div><hr>"
		recipe_html += recipe_thumb


	template_text = """	<!DOCTYPE html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>RECIPES LANDING</title>
		<script src="node_modules/jquery/dist/jquery.min.js"></script>
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
		<script src="node_modules/bootstrap/dist/js/bootstrap.js"></script>
		<link rel="stylesheet" type="text/css" href="css/recipestyle.css">
	</head>

	<div class="container bottom-pad">
    <hr>
    <h2 class="centered-title">RECIPES</h2>
    <hr>
    {0}
	</div>
	</html>
	""".format(recipe_html)

	recipe_file.write(template_text)
	print("succesfully wrote template: ", template_text)


if __name__ == '__main__':
	main()