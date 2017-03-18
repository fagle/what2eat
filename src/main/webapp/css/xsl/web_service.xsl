<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
	version="2.0" 
	xmlns:html="http://www.w3.org/TR/REC-html40" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	 <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  	<xsl:template match="/">
		<html>
		<head>
		<meta charset="UTF-8"/>
		<title>GM系统健康状况查询接口说明文档</title>
		<script type="text/javascript" src="js/highlight/highlight.pack.js"></script>
		<link rel="stylesheet" title="Default" href="js/highlight/styles/default.css" />
		<style>
		body, pre{margin:0; padding:0;}
		</style>
		<script>
		hljs.initHighlightingOnLoad();
		</script>  
		</head>
		<body>
			<pre>
				<code class="html hljs">
					 <xsl:value-of select="/controller/doc"/>
				</code>
			</pre>
		</body>
		</html>
  </xsl:template>
</xsl:stylesheet>
