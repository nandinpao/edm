/**
 * 
 */
var d3m = {
		
	module : {
		circle : function(obj){
			
			var $target = $("#" + obj.target);
			
			const width = $target.parent().width();
			const height = $target.parent().height();

			const generateChart = data => {
				
			    const bubble = data => d3.pack()
			        .size([width, height])
			        .padding(1)(d3.hierarchy({ children: data }).sum(d => d.number));

			    const svg = d3.select('#' + obj.target)
			        .style('width', width)
			        .style('height', height);
			    
			    const root = bubble(obj.data);
			    const tooltip = d3.select('.tooltip');

			    const node = svg.selectAll()
			        .data(root.children)
			        .enter().append('g')
			        .attr('transform', `translate(${width / 2}, ${height / 2})`);
			    
			    
			    const circle = node.append('circle')
			    	.style("fill", utils.randomColor )
			        .on('mouseover', function (e, d) {
			            tooltip.select('span').text(d.data.title);
			            tooltip.style('visibility', 'visible');
			            d3.select(this).style('stroke', '#222');
			        })
			        .on('mousemove', e => tooltip.style('top', `${e.pageY}px`)
			                                     .style('left', `${e.pageX + 10}px`))
			        .on('mouseout', function () {
			            d3.select(this).style('stroke', 'none');
			            return tooltip.style('visibility', 'hidden');
			        });
			    
			    const label = node.append('text')
			    	.attr("text-anchor", "middle")
			        .text(function(d) {
				       return d.data.title.substring(0, d.r / 3);
				    })

			    node.transition()
			        .ease(d3.easeExpInOut)
			        .duration(1000)
			        .attr('transform', d => `translate(${d.x}, ${d.y})`);
			    
			    circle.transition()
			        .ease(d3.easeExpInOut)
			        .duration(1000)
			        .attr('r', d => d.r);
			    
			    label.transition()
			        .delay(700)
			        .ease(d3.easeExpInOut)
			        .duration(1000)
			        .style('opacity', 1)
			};

			(async () => {
			    generateChart(obj.data);
			})();
			
		}
	}
}