<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.9.1/themes/base/jquery-ui.css" />
    <script src="http://code.jquery.com/jquery-1.8.2.js"></script>
    <script src="http://code.jquery.com/ui/1.9.1/jquery-ui.js"></script>
    <link rel="stylesheet" href="/resources/demos/style.css" />
    <style>
    .ui-progressbar .ui-progressbar-value { background-image: url(images/pbar-ani.gif); }
    </style>
    <script>
    
    var i=0;
    $(function() {
        $( "#progressbar" ).progressbar({
            value: 59
        });
        $( "#progressbar"+i ).progressbar({
            value: 51
        });
  
  
    });
    </script>


<title>List of Students</title>
</head>
<body>
	<p></p>
	 <div class="text">
        <h4>
5TH Grade - Geometry Class
       </h4> 
        </div>
	<table border="1" style="text-align: center" cellpadding="5px">
		<tr>
			<th id="header.teacher" style="width: 300px">Teacher Name</th>
			<th id="header.realm" style="width: 300px">Class Learning Map</th>
						<th id="header.realm" style="width: 300px">Class Progress</th>
			
		</tr>

		<c:forEach var="teacher" items="${tenantMap}">
			<tr>
				<td id="name.${teacher.key}" style="width: 300px">${teacher.key}</td>
				<td id="realm.${teacher.value}" style="width: 300px"><a href="/sample/example2.html">Class Learning Map</td>
								<td id="realm.${teacher.value}" style="width: 300px"><div id="progressbar"></div>
</td>
				
			</tr>
		</c:forEach>
	</table>
	<p></p>
	<p></p>
	<table border="1" style="text-align: center" cellpadding="5px">
		<tr>
			<th id="header.Student" style="width: 300px">List of Students</th>
					<th id="header.Student" style="width: 300px">Learning Maps</th>
			<th id="header.Student" style="width: 300px">Progress</th>
	
		</tr>
		<c:forEach var="student" items="${grades}" varStatus="counts">
		
			<tr>
				<td id="name.${student.key}" style="width: 300px">${student.key}</td>
				<td id="name.${student.key}" style="width: 300px"><a href="/sample/learningMap.html">Individual Learning Map</td>
			<td id="realm.${teacher.value}" style="width: 300px"><div id="progressbar"+counts.count></div>
</td		
			</tr>
		
		</c:forEach>
	</table>
</body>
</html>